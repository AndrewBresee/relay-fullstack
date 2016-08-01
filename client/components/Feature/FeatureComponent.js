/* eslint-disable global-require */
import React from 'react';
// import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button } from 'react-mdl';
import { Grid, Cell } from 'react-mdl';
import Page from '../Page/PageComponent';
// import styles from './Feature.scss';

// this extends the fragment query
// which contains all of the node with feature information
// from FeatureContainer
export default class Feature extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <Page heading='Integrated with'>
        <Grid>
          <Cell col={12}>Designed by {this.props.viewer.givenName} {this.props.viewer.familyName}</Cell>
        </Grid>
      </Page>
    );
  }
}
