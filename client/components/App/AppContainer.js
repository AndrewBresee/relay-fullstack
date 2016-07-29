import Relay from 'react-relay';
import App from './AppComponent';
import Footer from '../Footer/FooterContainer';

// This wraps around App
// This is a fragment on a viewer object.
export default Relay.createContainer(App, {
  fragments: {
    // server data will be expected to populate the 'viewer' prop. So the fragment will come from "frament on  viewer" or fragments.viewer.
    viewer: () => Relay.QL`
      fragment on GoogleUser {
        ${Footer.getFragment('viewer')}
      }`
  }
});
