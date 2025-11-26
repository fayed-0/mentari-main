declare module 'formidable' {
  const formidable: any;
  namespace formidable {
    // minimal shapes used in the project
    type Fields = { [key: string]: any };
    type Files = { [key: string]: any };
    interface IncomingForm {
      parse: (req: any, cb: (err: any, fields: Fields, files: Files) => void) => void;
    }
  }
  export default formidable;
}
