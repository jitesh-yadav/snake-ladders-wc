import { SnakeLaddersModule } from './snake-ladders.module';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

const bootstrap = () => platformBrowserDynamic().bootstrapModule(SnakeLaddersModule);
bootstrap().catch(err => console.error(err));