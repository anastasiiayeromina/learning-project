import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../bus/user/actions';
import { getIncreasedUserType } from '../helpers/getIncreasedUserType';

const UserInfo = (props) => {
  const {} = props;
  const {user} = useSelector((state) => state);
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(userActions.setUserType({ userType: getIncreasedUserType(user.userType)}));
  }

  return (
    <>
      <ul>
        <li>Id: {user.userId}</li>
        <li>Visit counts: {user.visitCounts}</li>
        <li>Status: {user.userType}</li>
      </ul>
      <button type='button'
        onClick={onClick}>Временно повысить свой статус</button>
    </>
  );
};

export default UserInfo;