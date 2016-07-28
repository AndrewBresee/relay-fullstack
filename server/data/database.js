import mysql from 'mysql';
// connct to the db
// const connection = mysql.createConnection({
//   host: 'gs-db-instance1.crkurxczxv8y.us-west-1.rds.amazonaws.com',
//   user: 'abresee',
//   password: 'SmartTest1234',
//   database: 'RelayFullstack'
// });
//
// connection.connect((err) => {
//   if (err) {
//     console.log(chalk.red('There was an error connecting to the DB'));
//     return;
//   }
//   console.log(chalk.green('Connection to the DB has been made'));
// });

class GoogleUser {
  constructor(id, user, firstName, lastName) {
    this.id = id;
    this.user = id;
    this.givenName = firstName;
    this.familyName = lastName;
  }
}
// Update this to save google user information
class User {
  constructor(id, name, username, website) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.website = website;
  }
}

class Feature {
  constructor(id, name, description, url) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
  }
}

const lvarayut = new User('1', 'Varayut Lerdkanlayanawat', 'lvarayut', 'https://github.com/lvarayut/relay-fullstack');
const features = [
  new Feature('1', 'React', 'A JavaScript library for building user interfaces.', 'https://facebook.github.io/react'),
  new Feature('2', 'Relay', 'A JavaScript framework for building data-driven react applications.', 'https://facebook.github.io/relay'),
  new Feature('3', 'GraphQL', 'A reference implementation of GraphQL for JavaScript.', 'http://graphql.org'),
  new Feature('4', 'Express', 'Fast, unopinionated, minimalist web framework for Node.js.', 'http://expressjs.com'),
  new Feature('5', 'Webpack', 'Webpack is a module bundler that packs modules for the browser.', 'https://webpack.github.io'),
  new Feature('6', 'Babel', 'Babel is a JavaScript compiler. Use next generation JavaScript, today.', 'https://babeljs.io'),
  new Feature('7', 'PostCSS', 'PostCSS. A tool for transforming CSS with JavaScript.', 'http://postcss.org'),
  new Feature('8', 'MDL', 'Material Design Lite lets you add a Material Design to your websites.', 'http://www.getmdl.io')
];

// Will need to make GoogleUser methods as well
// Will need to connect this to the mysql database
function getGoogleUser(id) {
  connection.query('SELECT * FROM googleUsers WHERE id = ?', [id], (error, results) => {
    // console.log('Query called');
    if (results.length < 1) {
      console.log('User not found');
    } else if (error) {
      console.log('Error in query: ', error);
    } else {
      return results.user;
    }
  });
}

function getUser(id) {
  return id === lvarayut.id ? lvarayut : null;
}

function getFeature(id) {
  return features.find(w => w.id === id);
}

function getFeatures() {
  return features;
}

export {
  User,
  Feature,
  getUser,
  getFeature,
  getFeatures,
  GoogleUser,
  getGoogleUser
};
