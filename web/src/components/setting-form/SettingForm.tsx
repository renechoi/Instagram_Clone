// react modules
import { useState, useRef } from 'react';
import { useForm, RegisterOptions } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// // Services
import { UserService } from '../../services/UserService';

// // actions
import { UpdateUser } from '../../reducers/UserReducer';

// Models
import { UserState } from '../../models/user';

// Styles
import './SettingForm.css';
import axios from 'axios';

const SettingForm = () => {
  const usernameOpts: RegisterOptions = {
    minLength: 6
  };
  const passwordOpts: RegisterOptions = {
    minLength: 6,
  }
  const [errorMsg, setErrorMsg] = useState("");
  const [modal, setModal] = useState(" profile-modal-hide");
  const user = useSelector((state: {UserState: UserState}) => state.UserState.user);
  const { register, getValues, setValue, reset, formState: { errors } } = useForm({mode:'onChange'});
  const dispatch = useDispatch();
  const fileInput:any = useRef(null);

  const handleInput = () => {
    const [username, description] = getValues(['username', 'description']);
    let userData: any = {pk: user.pk};
    if (username !== '') {
      userData = {...userData, username};
    }
    if (description !== '') {
      userData = {...userData, description}
    }

    if (Object.keys(userData).length !== 0) {
      console.log("hello");
      dispatch<any>(UserService.update(userData));
    }
  }

  const changePassword = () =>{
    const [password, new_password, new_password_check] = getValues(['password', 'new_password', 'new_password_check']);
    setValue("password", password, { shouldValidate: true, shouldDirty:true });
    setValue("new_password", new_password, { shouldValidate: true, shouldDirty:true });
    setValue("new_password_check", new_password_check, { shouldValidate: true, shouldDirty:true });

    if (errors.password === undefined &&
        errors.new_password === undefined &&
        errors.new_password_check === undefined) 
    {
      if (new_password === new_password_check) {
        let userData: any = { password, new_password };
        axios.put(`/users/${user.pk}/password`, userData)
          .then(()=>{
            reset({password:'', new_password:'', new_password_check:''})
          })
          .catch((error)=> {
            let e = "";
            Object.keys(error.response.data).map((key)=>{
              e = error.response.data[key];
              return null;
            });
            setErrorMsg(e);
          })
        
      } else {
        setErrorMsg("비밀번호가 일치하지 않습니다.")
      }
    } else {
      setErrorMsg("비밀번호를 확인해주세요.")
    }

  }
  const hideModal1 = (event: any) => {
    if (event.target.id === "modal") {
      setModal(" profile-modal-hide");
    }
  }
  const hideModal2 = () => {
    setModal(" profile-modal-hide");
  }
  const showModal = () => {
    setModal(" profile-modal-show");
  }

  const openFileSelector = () => {
    fileInput.current.click();
  }

  const uploadFile = (event: any) => {
    console.log(event);
    console.log(event.target.files);
    if (event.target.value !== "") {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      axios.put(`users/${user.pk}/profile`, formData)
        .then((resp)=>{
          console.log(resp);
          dispatch<any>(UpdateUser(resp.data));
          hideModal2();
        })
        .catch((error)=>{
          let e = "";
          Object.keys(error.response.data).map((key)=>{
            e = error.response.data[key];
            return null;
          });
          setErrorMsg(e);
        })
    }
  }

  const deleteFile = () => {
    axios.delete(`users/${user.pk}/profile`)
      .then((resp)=>{
        dispatch<any>(UpdateUser(resp.data));
        hideModal2();
      })
  }

  return (
    <div>
      <div className="profile-form">
        <div className="profile-header-container">
          <img 
            className="profile-header-img" 
            src={user.profile? user.profile : "profile.png"}
            alt="user profile" 
          />
          <div className="profile-header-username">
            <h1 className="profile-header-username-text">{user.username}</h1>
            <button className="profile-header-username-btn" onClick={showModal}>프로필 사진 바꾸기</button>
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
            이메일
          </div>
          <div className="profile-input-data">
            <input 
              className="profile-input" 
              type="text" 
              placeholder="이메일" 
              defaultValue={user.email} 
              disabled 
            />
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
            사용자 이름
          </div>
          <div className="profile-input-data">
            <input 
              className="profile-input" 
              type="text" 
              placeholder="사용자 이름" 
              defaultValue={user.username} 
              {...register("username", usernameOpts)}
            />
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
            소개
          </div>
          <div className="profile-input-data">
            <textarea 
              className="profile-input profile-textarea" 
              placeholder="사용자 이름" 
              defaultValue={user.description} 
              {...register('description')}
            > 
            </textarea>
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
          </div>
          <div className="profile-input-data">
            <button className="profile-input-button" type="button" onClick={handleInput}>제출</button>
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
            이전 비밀번호
          </div>
          <div className="profile-input-data">
            <input 
              className="profile-input" 
              type="password" 
              {...register("password", passwordOpts)}
            />
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
            새 비밀번호
          </div>
          <div className="profile-input-data">
            <input 
              className="profile-input" 
              type="password" 
              {...register("new_password", passwordOpts)}
            />
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
            새 비밀번호 확인
          </div>
          <div className="profile-input-data">
            <input 
              className="profile-input" 
              type="password"
              {...register("new_password_check", passwordOpts)} 
            />
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
          </div>
          <div className="profile-input-data">
            <input 
              className="profile-input" 
              ref={fileInput}
              hidden
              type="file"
              accept="image/*"
              onChange={uploadFile}
            />
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
          </div>
          <div className="profile-input-data">
            <button 
              className="profile-input-button" 
              type="button"
              onClick={changePassword}
            >
              비밀번호 변경
            </button>
          </div>
        </div>
        <div className="profile-input-container">
          <div className="profile-input-label">
          </div>
          <div className="profile-input-data">
            {errorMsg !== "" && <div className="profile-form-error">{errorMsg}</div>}
          </div>
        </div>
      </div>
      <div id="modal" className={"profile-modal-container" + modal} onClick={hideModal1}>
        <div className="profile-modal">
          <div className="profile-modal-title-container">
            <div className="profile-modal-title">
              <div>프로필 사진 바꾸기</div>
            </div>
          </div>
          <div className="profile-modal-content-container">
            <div className="profile-modal-button profile-modal-button-blue" onClick={openFileSelector}>
              <div>
                사진 업로드
              </div>
            </div>
            <div className="profile-modal-button profile-modal-button-red" onClick={deleteFile}>
              <div>            
                현재 사진 삭제
              </div>
            </div>
            <div className="profile-modal-bottom-button" onClick={hideModal2}>
              <div>
                취소
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingForm;