// Core
import Document, {
  Html,
  Main,
  Head,
  NextScript
} from 'next/document';
// Elements
import { Roboto } from '../elements/roboto';

export default class CustomDocument extends Document {
  render() {
    console.log('Document');

    return (
      <Html lang='en'>
        <Head/>
        <Roboto/>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}