import { useParams } from "react-router-dom";

function User() {
  const params = useParams();
  return <div>I am user {params.username}</div>;
}
export default User;
