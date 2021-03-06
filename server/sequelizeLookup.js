import Sequelize from 'sequelize';


const ORM = new Sequelize('RelayFullstack', 'abresee', 'SmartTest1234', {
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  host: 'gs-db-instance1.crkurxczxv8y.us-west-1.rds.amazonaws.com',
  port: 3306,
  dialect: 'mysql'
});

ORM
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

const SequelizeGoogleUser = ORM.define('googleUsers', {
  user: {
    type: Sequelize.STRING
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

export { ORM, SequelizeGoogleUser };
