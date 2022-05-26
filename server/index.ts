import { Database } from "./Database";
import Express from "./Express";

class App {

  public static loadServer(): void {
    Express.init();
  }

  public static loadDatabase(): void {
    Database.init();
  }
}

export default App;