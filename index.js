// 모듈화 해야 하는 함수들입니다.
function createRequest(projectId, sessionId, chatText) {
    return {
      session: sessionClient.sessionPath(projectId, sessionId),
      queryInput: {
        text: {
          text: chatText,
          languageCode: 'ko'
        }
      }
    }
  }
  
  // express 세팅
  const express = require("express")
  const app = express()
  
  /* dialogflow, uuid, fs 세팅 */
  const dialogflow = require('dialogflow').v2beta1;
  const fs = require('fs')
  
  // req.body 설정
  app.use(express.json())
  
  // DialogFlow 연결 설정
  // 다른 파일로 빠져야 되요. 모듈화 하셔야합니다.
  const projetId = 'newagent-ktepwl'
  const keyfile = JSON.parse(fs.readFileSync("./newagent-ktepwl-17df02edefde.json"))
  const privateKey = keyfile.private_key
  const clientEmail = keyfile.client_email
  
  // 사용자마다 다른 임의의 값이 들어갈 것임 (팩트 체크 필요)
  const sessionId = "12345"
  
  const dialogConfig = {
    credentials: {
      private_key: privateKey,
      client_email: clientEmail
    }
  }
  
  // DialogFlow Client 생성
  const sessionClient = new dialogflow.SessionsClient(dialogConfig);
  
  app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });
  
  /* 여기서부턴 API */
  app.post("/chat", (req, res) => {
    // chatText : React에서 axios로 body에 넣어줘야 할, 사용자가 입력한 채팅 내용
    const chatText = req.body.chatText
  
    // 사용자마다 다른 임의의 값이 sessionId에 들어가는 게 맞다면 여기서 sessionId를 임의로 설정해주세요
    sessionClient.detectIntent(createRequest(projetId, sessionId, chatText))
      .then((response) => {
        //console.log(response)
        const aaa = response[0].queryResult.fulfillmentMessages[0].text.text
    
        const x = aaa.toString();
   
        const bandibotResponse = response[0].queryResult.fulfillmentText
       
        res.end(bandibotResponse)
      })
  })
  
  app.listen(9000, () => {
    console.log("Server is running at port 9000")
  })
  
  /*
  
  프론트에서는 이런식으로 하겠죠...?
  axios.get("/chat", { chatText: this.state.blabla })
  .then((response) => {
    // 여기서 채팅 컴포넌트를 하나 만들고, 그때 서버에서 온(실제로는 Dialogflow에서 온) 메시지를 넣어준다
  
  })
  
  */