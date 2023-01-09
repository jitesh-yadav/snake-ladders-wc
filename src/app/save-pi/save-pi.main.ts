import { SavePiModule } from './save-pi.module';
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

const bootstrap = () => platformBrowserDynamic().bootstrapModule(SavePiModule);
bootstrap().catch(err => console.error(err));