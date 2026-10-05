import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserObservatory } from "../../reducers/userObservatoryReducer";

export const ClearObservatory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserObservatory(""));
    navigate("/");
  }, []);
};
