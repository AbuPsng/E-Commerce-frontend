import { MdError } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="container not-found">
      <MdError />
      <h1>Page not found</h1>
    </div>
  );
};

export default NotFound;
