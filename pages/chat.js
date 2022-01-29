import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import MessageList from "../src/components/MessageList";

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPABASE_ANON_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQwNjk1NCwiZXhwIjoxOTU4OTgyOTU0fQ.p59iFiQZABTDO7gakJQEh5KbUkvYV5nAh6CJNszMVd0';
const SUPABASE_URL = 'https://rkjmbcdfiwxjcluipdtd.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_key);

function listeningChanges(newMessage) {
    return supabaseClient
      .from('Messages')
      .on('INSERT', (responseLive) => {
        newMessage(responseLive.new);
      })
      .subscribe();
}

export default function ChatPage() {
    const router = useRouter();
    const userLogin = router.query.username;
    const [message, setMessage] = React.useState("");
    const [messageList, setMessageList] = React.useState([]);

    const subscription = listeningChanges((newMessage) => {
        // console.log('Nova mensagem:', newMessage);
        // console.log('listaDeMensagens:', messageList);

        setMessageList((currentValueMessageList) => {
        //   console.log('valor Atual Da Lista:', currentValueMessageList);
          return [
            newMessage,
            ...currentValueMessageList,
          ]
        });
  
      return () => {
        subscription.unsubscribe();
      }
    }, []);

    function handleNewMessage(newMessage) {
        const Messages = {
            from: userLogin,
            text: newMessage,
        };

        supabaseClient
            .from('Messages')
            .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
                Messages
            ])
            .then(({ data }) => {
                // console.log('Criando mensagem: ', data);
            });
        setMessage("");
    }

    return (
        <Box
            styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",

                color: appConfig.theme.colors.neutrals["000"],
            }}
        >
            <Box
                styleSheet={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    borderRadius: "5px",
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: "100%",
                    maxWidth: "95%",
                    maxHeight: "95vh",
                    padding: "32px",
                }}
            >
                <Header />

                <Box
                    styleSheet={{
                        position: "relative",
                        display: "flex",
                        flex: 1,
                        height: "80%",
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: "column",
                        borderRadius: "5px",
                        padding: "16px",
                    }}
                >
                    <MessageList message={messageList} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => {
                                const valor = event.target.value;

                                setMessage(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua message aqui..."
                            type="textarea"
                            styleSheet={{
                                width: "100%",
                                border: "0",
                                resize: "none",
                                borderRadius: "5px",
                                padding: "6px 8px",
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: "12px",
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    {/* callback - é sempre uma chamada de retorno */}
                        <ButtonSendSticker 
                            onStickerClick={(sticker)=>{
                                console.log('[USANDO O COMPONENT] Salva esse sticker no banco')
                                handleNewMessage(`:sticker: ${sticker}`);
                            }}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    width: "100%",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text variant="heading5">Chat</Text>

                <Button
                    variant="tertiary"
                    colorVariant="neutral"
                    label="Logout"
                    href="/"
                />
            </Box>
        </>
    );
}