export const RequestError = ({ message }: { message: string }): React.JSX.Element => (
  <p className="text text_type_main-default p-10" role="alert">
    {message}
  </p>
);
