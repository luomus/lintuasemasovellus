import { useEffect } from "react";
import { getLogout } from "../../services";
import { setUser } from "../../reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  useEffect(() => {
    if (!user.id) {
      navigate("/");
      return;
    }

    getLogout()
      .then(() => {
        dispatch(setUser({}));
        navigate("/");
      });
  }, [user]);
};
