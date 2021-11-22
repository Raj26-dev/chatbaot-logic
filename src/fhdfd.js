import React, { useState, useEffect } from "react";
import "./App.scss";
import axios from "axios";
import Questionhandler from "./function";
import data from "./data.json";

function App() {
  const initialformstate = {
    userresponse: [],
  };

  const [questions, setquestions] = useState(data);
  const [text, settext] = useState("");
  const [storedquestions, setstoredquestions] = useState({});
  const [isText, setisText] = useState(false);
  const [currentquestion, setcurrentquestion] = useState({});
  const [counter, setcounter] = useState(0);
  const [form, setform] = useState(initialformstate);
  console.log(new Date().getUTCMilliseconds());
  useEffect(() => {
    if (window.localStorage.getItem("lastleftquestion")) {
      setcounter(parseInt(window.localStorage.getItem("lastleftquestion")));
    } else {
      setcurrentquestion(questions[0]);
    }
    if (window.localStorage.getItem("chatbotdata")) {
      console.log(JSON.parse(window.localStorage.getItem("chatbotdata")));
      setform(JSON.parse(window.localStorage.getItem("chatbotdata")));
      setstoredquestions(
        JSON.parse(window.localStorage.getItem("chatbotdata")).userresponse
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // let q=fetchquestions();
    // if(q){
    //   setquestions(q)
    // }
    if (window.localStorage.getItem("lastleftquestion") !== "full") {
      setcurrentquestion(questions[counter]);
    }

    console.log(counter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const handleSubmit = async (obj1, value) => {
    console.log(obj1, value);
    let uservalues = [...form.userresponse, { item: obj1, response: value }];

    setform({ ...form, userresponse: uservalues });
    console.log({ ...form, userresponse: uservalues });
    window.localStorage.setItem(
      "chatbotdata",
      JSON.stringify({ ...form, userresponse: uservalues })
    );

    setstoredquestions({ ...form, userresponse: uservalues }.userresponse);
    if (counter >= questions.length - 1) {
      window.localStorage.setItem("lastleftquestion", "full");
      const array = JSON.parse(
        window.localStorage.getItem("chatbotdata")
      ).userresponse;
      console.log(array);
      axios
        .post("https://tbsdemos.com/bot_uat/api/Login/test", {
          json: JSON.stringify([...array]),
        })
        .then((res) => {
          console.log(res.status);
        })
        .catch(function (error) {
          console.log(error);
        });
      // const res = await fetch("https://tbsdemos.com/bot_uat/api/Login/test", {
      //   method: "POST",
      //   json: JSON.stringify(array),
      // });
      // const data = await res.json();
      // console.log(data);
      alert("thanks");
    } else {
      window.localStorage.setItem("lastleftquestion", counter + 1);
      setcounter((counter) => counter + 1);
    }
  };
  const handlebutton = () => {
    handleSubmit(currentquestion, text);
    settext("");
  };
  const textchangehandler = (e) => {
    settext(e.target.value);
  };

  const fetchquestions = async () => {
    const res = await fetch("https://tbsdemos.com/bot_uat/api/Login/question");
    const data = res.json();
    return data;
  };
  return (
    <div className="App">
      {Object.keys(storedquestions).length > 0 && (
        <div style={{ backgroundColor: "black", color: "white" }}>
          {storedquestions.map((question, index) => (
            <div key={index}>
              <p> {question.item.question}</p>
              {question.item.type !== "multi" && <p>{question.response}</p>}
              {question.item.type === "multi" && (
                <ul>
                  {question.response.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {window.localStorage.getItem("lastleftquestion") === "full" ? (
        <p>you have answered all questions</p>
      ) : (
        Questionhandler(currentquestion, handleSubmit)
      )}

      <input
        id={currentquestion.id}
        value={text}
        type="text"
        onChange={(e) => {
          textchangehandler(e);
        }}
        style={{ marginTop: "20px", marginLeft: "130px" }}
        disabled={currentquestion.type !== "text"}
      />
      <button
        onClick={() => handlebutton()}
        disabled={currentquestion.type !== "text"}
      >
        send
      </button>

      <div className="container">
        <p>gfgfg</p>
      </div>
    </div>
  );
}

export default App;