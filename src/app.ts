import cors from "cors"
import express from "express"
import bodyParser from 'body-parser'
import {Sequelize} from 'sequelize-typescript'

export default class App {
  private port: number;
  private sequelize: Sequelize;
  private app: express.Application;

  constructor(controllers: any[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeDb();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeDb() {
    this.sequelize =  new Sequelize({
            database: 'inu_health',
            dialect: 'mysql',
            username: 'root',
            password: 'password',
            storage: ':memory:',
            models: [__dirname + '/models'],
            define: {
              timestamps: false
          }
    });
  }
}