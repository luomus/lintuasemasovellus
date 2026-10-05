import { useEffect } from "react";
import { getLogout } from "../../services";
import { setUser } from "../../reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
      })
      .catch(e => {
        alert(t("logoutFailed"));
        console.error(e);
        navigate("/");
      });
  }, [user]);
};
