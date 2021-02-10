import { setCookie } from 'nookies';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../bus/user/actions';
import { selectUserId, selectVisitCounts, selectUserType } from '../bus/user/selectors';
import { getIncreasedUserType } from '../helpers/getIncreasedUserType';

const UserInfo = (props) => {
  const {} = props;
  const dispatch = useDispatch();

  const userId = useSelector(selectUserId);
  const visitCounts = useSelector(selectVisitCounts);
  const userType = useSelector(selectUserType);

  const onClick = () => {
    dispatch(userActions.setUserType({ userType: getIncreasedUserType(userType)}));
    setCookie(null, 'isIncreased', true);
  }

  return (
    <>
      <ul>
        <li>Id: {userId}</li>
        <li>Visit counts: {visitCounts}</li>
        <li>Status: {userType}</li>
      </ul>
      <button type='button'
        onClick={onClick}>Временно повысить свой статус</button>
    </>
  );
};

export default UserInfo;