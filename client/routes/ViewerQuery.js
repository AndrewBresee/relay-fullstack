import Relay from 'react-relay';


// This is the route query
export default {
  viewer: (Component) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer')}
      }
    }
  `
};
