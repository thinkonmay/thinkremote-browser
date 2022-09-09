import React, { useEffect, useRef, useState, } from 'react'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import formstyles from '../../styles/form.module.css'

/**
 * @returns {Headers}
 */
const genHeaders = () => {
	return Object.assign(
		{ "Content-Type": "application/json" },
	)
}

const Home = () => {
  const [state, setState] = useState({
    user: "",
    server: "",
    secret: "",
  });

  useEffect(() => { 
    fetchServers();

  }, [])


  function handleUserChange(e) {
    setState({ ...state, ["user"]: e.target.value });
  }
  function handleSecretChange(e) {
    setState({ ...state, ["secret"]: e.target.value });
  }
  function handleServerSelect(e) {
    setState({ ...state, ["server"]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    fetch(`https://auth.thinkmay.net/auth/client/${state.user}/${state.server}/${state.secret}`, {
      method: "GET",
      headers: genHeaders(),
    }).then((res) => {
      if (res.status != 200) {
        window.location.replace("/main");
        return;
      }
      res.text().then((token) => {
        var width = window.innerWidth * 0.66;
        var height = width * window.innerHeight / window.innerWidth;
        window.open(`/?token=${token}`, 'newwindow', 
          `width=${width},height=${height},top=${((window.innerHeight - height) / 2)},left=${((window.innerWidth - width) / 2)}`);
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  async function fetchServers() {
    try {
      var result = await (await 
      fetch("https://auth.thinkmay.net/auth/allServer", {
        method: "GET",
        headers: genHeaders(),
      })).json()

      var el = document.getElementById("bangbo");
      result.forEach((x) => {
        el.innerHTML += `<option value="${x.name}">${x.name}</option>`
      })
    } catch (err) {
      console.log(err);
    }
  }



  return (
    <div className={styles.app}>
      <div >
        <form onSubmit={handleSubmit} className={formstyles.form}>
        <input className={formstyles.input}
          name="email"
          placeholder="Enter email"
          onChange={handleUserChange}
          value={state.user}
          required/>
        <input className={formstyles.input}
          name="secret"
          placeholder="Enter secret"
          onChange={handleSecretChange}
          value={state.secret}
          required/>
        <select 
          className={formstyles.select} 
          id="bangbo"
          onChange={handleServerSelect}
          >
        </select>
        <button type="submit" className={formstyles.label}>
          Send
        </button>
      </form>
      </div>
    </div>
  )
}

export default Home
