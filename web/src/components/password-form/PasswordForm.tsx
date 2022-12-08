// react modules
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, RegisterOptions } from 'react-hook-form';

// external modules
import axios from 'axios';

// Assets
import LockIcon from '../../icons/lock.svg';

const PasswordForm = () => {
  const emailOpts: RegisterOptions = {
    required: true,
    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  }
  const authcodeOpts: RegisterOptions = {
    pattern: /^.{6}$/
  }
  const passwordOpts: RegisterOptions = {
    minLength: 6,
  }

  const [current, setCurrent] = useState("email");
  const [btnLabel, setBtnLabel] = useState("인증코드 전송하기");
  const [time, setTime] = useState(299);
  const [timeStr, setTimeStr] = useState("5:00");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, setValue, getValues, reset, formState: {errors, isDirty} } = useForm({ mode: 'onChange' });
  const navi = useNavigate();
  
  useEffect(()=>{
    if(current==="authcode") {
      const timer = setInterval(()=>{
        if (time > 0) {
          setTime(t=>t-1);
        }
        if (time === 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  }, [current]);

  useEffect(()=>{
    if (time >= 0) {
      let min = Math.floor(time / 60);
      let sec = time % 60;
      let str = `${min}:${sec.toString().padStart(2, '0')}`
      setTimeStr(str);
    }
  }, [time]);

  const handleInput = () => {
    let data = getValues();
    if (current === 'email') {
      setValue('email', data.email, {shouldValidate: true, shouldDirty: true});
      console.log(errors);
      if (errors?.email?.type === "required") {
        setErrorMsg("이메일을 입력해 주세요.");
      } else if (errors?.email?.type === "pattern") {
        setErrorMsg("올바른 이메일 형식이 아닙니다.");
      } else if (isDirty && (errors.email === undefined)) {
        axios.post('/users/authcode', data)
          .then((resp)=>{
            console.log(resp);
            reset({...data}, {keepDirty: false});
            setCurrent('authcode');
            setBtnLabel('인증코드 확인하기');
            setErrorMsg("");
            window.alert(resp.data.authcode);
          })
          .catch((error)=>{
            console.log(error);
            setErrorMsg(error.response.data.message);
          });
      }
    } else if (current === 'authcode') {
      setValue('authcode', data.authcode, {shouldValidate: true, shouldDirty: true});
      if (errors?.authcode?.type === 'pattern') {
        setErrorMsg("인증코드 형식에 맞지 않습니다.");
      } else if (isDirty && (errors?.authcode === undefined)) {
        axios.put('/users/authcode', data)
          .then((resp)=>{
            reset({...data}, {keepDirty: false});
            setCurrent('password');
            setBtnLabel('비밀번호 변경');
            setErrorMsg("");
          })
          .catch((error)=>{
            setErrorMsg(error.response.data.message);
          })
      }
    } else if (current === 'password') {
      setValue('password', data.password, {shouldValidate: true, shouldDirty: true});
      if (errors?.password?.type === 'minLength') {
        setErrorMsg("비밀번호 형식에 맞지 않습니다.");
      } else if ( isDirty && (errors.password === undefined)) {
        axios.put('/users/password', data)
          .then((resp)=>{
            navi('/signin', {replace:true})
          })
          .catch((error)=>{
            setErrorMsg(error.response.data.messgae);
          });
      }
    }
  }

  const toSignin = ()=>{
    navi('/signin');
  }

  return (
    <form className="password-form">
      <img className="form-content-icon" src={LockIcon} alt="lock.svg" />
      <div className="form-content-title">로그인에 문제가 있나요?</div>
      <div className="form-content-subtitle">이메일 주소를 입력하시면 계정에 다시 액세스할 수 있는 인증코드를 보내드립니다.</div>
      {
        current === "email" &&
        <input className="form-input" type="text" placeholder='이메일' {...register('email', emailOpts)} />
      }
      {
        current === "authcode" &&
        <div>
          <input className="form-input" type="text" placeholder='인증코드' {...register('authcode', authcodeOpts)} />
          <span className="form-expired">{timeStr}</span>
        </div>
      }
      {
        current === "password" &&
        <input className="form-input" type="password" placeholder='비밀번호' {...register('password', passwordOpts)}/>
      }
      <button className="form-btn form-btn-blue" type="button" onClick={handleInput}>{btnLabel}</button>
      <Link className="signup-link noline-link" to="/signup">새 계정 만들기</Link>
      { errorMsg !== "" && <div className="form-error">{errorMsg}</div>}
      <button className="form-btn form-btn-bottom" onClick={()=>toSignin()}>로그인으로 돌아가기</button>
    </form>
  );
}

export default PasswordForm