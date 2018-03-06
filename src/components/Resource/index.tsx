import * as React from 'react';
import axios from 'axios';

import { RouteComponentProps } from 'react-router';
import { Message, Button } from 'semantic-ui-react';

import { debounce } from '../../utils/debounce';
import { IJWT, ISettings } from '../../rootReducer';
import { ISchema } from '../../interfaces/json-schema';
import { IData } from '../../interfaces/misc';
import JsonEditor from './JsonEditor';

const VALIDATE_DEBOUNCE_TIME = 500; // ms

interface IConnectedProps {
  jwt: IJWT;
  schema: { [key: string]: ISchema };
  data: IData;
  settings: ISettings;
  push(location: any): any;
  messageToastr(message: string): any;
  errorToastr(message: string): any;
}

interface IState {
  loading: boolean;
  saving: boolean;
  data: any;
  valid: boolean | null;
  validationError: any;
}

type IProps = IConnectedProps & RouteComponentProps<{resourceType: string, id: string}>;

const validationMessage = (valid: boolean | null, validationError: string | null) => {
  if (valid) {
    return (
      <Message
        success={true}
        header="Data valid"
        content="Data has been validated"
      />
    );
  } else if (valid === false) {
    return (
      <Message
        negative={true}
        header="Invalid"
        content={validationError}
      />
    );
  } else {
    return (
      <Message
        color="yellow"
        header="Validating..."
        content="Validating data"
      />
    );
  }
};

export default class extends React.PureComponent<IProps, IState> {
  editor: JsonEditor | null = null;

  validate = debounce(
    (s: string) => {
      if (!this.isValidJSON(s)) {
        this.setState({
          valid: false,
          validationError: 'Syntax error'
        });
      } else {
        const { resourceType, id } = this.props.match.params;
        const { backendUrl } = this.props.settings;
        axios.patch(`${backendUrl}/${resourceType}/${id}?test`, s, {
          headers: {
            Authorization: `Bearer ${this.props.jwt.token}`
          }
        }).then(() => {
          this.setState({valid: true});
        }).catch(response => {
          this.setState({valid: false, validationError:
            `${(response.response.data.path || []).join(' -> ')}: ${response.response.data.error}`
          });
        });
      }
    },
    VALIDATE_DEBOUNCE_TIME
  );

  save(s: string) {
    this.setState({saving: true});
    const { resourceType, id } = this.props.match.params;
    const { backendUrl } = this.props.settings;
    axios.patch(`${backendUrl}/${resourceType}/${id}`, s, {
      headers: {
        Authorization: `Bearer ${this.props.jwt.token}`
      }
    }).then(() => {
      this.setState({saving: false});
      this.props.messageToastr('Saved');
    }).catch(response => {
      this.setState({saving: false});
      this.props.errorToastr(JSON.stringify(response));
    });
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      saving: false,
      loading: true,
      data: {},
      valid: true,
      validationError: null,
    };
  }

  getData() {
    const { resourceType, id } = this.props.match.params;
    const { backendUrl } = this.props.settings;
    axios.get(`${backendUrl}/${resourceType}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.props.jwt.token}`
      }
    }).then((result) => {
      this.setState({data: result.data, loading: false, valid: null});
      this.validate(JSON.stringify(result.data));
    });
  }

  componentWillMount() {
    this.getData();
  }

  componentWillReceiveProps(props: IProps) {
    console.log(props);
  }

  isValidJSON(s: string) {
    try {
      JSON.parse(s);
    } catch {
      return false;
    }
    return true;
  }

  onChange(s: string) {
    this.setState({valid: null});
    this.validate(s);
  }

  render() {
    if (this.state.loading) {
      return null;
    }
    return (
      <div style={{height: 'calc(100vh - 200px)'}}>
        <JsonEditor
          ref={elm => this.editor = elm}
          value={JSON.stringify(this.state.data, null, 2)}
          onChange={(s: string) => this.onChange(s)}
        />
        {validationMessage(this.state.valid, this.state.validationError)}
        <Button
          disabled={!this.state.valid || this.state.saving}
          onClick={() => this.save(this.editor && this.editor.getValue())}
        >
          {this.state.saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    );
  }
}
