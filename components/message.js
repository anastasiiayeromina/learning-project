import { useSelector } from 'react-redux';
import { getMessageByUserType } from '../helpers/getMessageByUserType';

const Message = (props) => {
  const {} = props;
  const {user} = useSelector((state) => state);
  console.log(user);
  
  return (
    <h1>{getMessageByUserType(user.userType)}</h1>
  );
};

export default Message;