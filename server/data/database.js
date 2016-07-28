// import mysql from 'mysql';
// import searchAndUpdateDatabase from '../index.js';
import Sequelize from 'sequelize';

const sequelize = new Sequelize('RelayFullstack', 'abresee', 'SmartTest1234', {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  host: 'gs-db-instance1.crkurxczxv8y.us-west-1.rds.amazonaws.com',
  port: 3306,
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });
const SequelizeGoogleUser = sequelize.define('googleUsers', {
  user: {
    type: Sequelize.INTEGER
  },
  givenName: {
    type: Sequelize.STRING
  },
  familyName: {
    type: Sequelize.STRING
  },
}, {
  timestamps: false,
  createdAt: false
});

SequelizeGoogleUser.findAll({
  where: {
    user: 109317027548384374583
  }
}).then((users) => {
  console.log('Found user from sequelize: ', users);
});

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
function getGoogleUser(userID) {
  SequelizeGoogleUser.findAll({
    where: {
      user: userID
    }
  }).then((users) => {
    console.log('Found user from sequelize: ', users);
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
