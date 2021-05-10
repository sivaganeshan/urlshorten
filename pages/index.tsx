import Head from "next/head";
import { Button, Layout, Form, Input, Typography , Alert} from "antd";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import axios, { AxiosError } from 'axios';

const { Header, Footer, Content } = Layout;
const {Title} =  Typography;
type shortenLinkResponse={
  shorten_link:string
}
type shortenLinkErrorResponse={
  error:string,
  error_description:string
}
type FormValues ={
  link:string;
}
export default function Home() {

const[status, setStatus]= useState<'info'|'error'|'success'>('info');
const[message, setMessage] = useState('');
const[form] = Form.useForm();

const onFinish = async ({link}:FormValues)=>{
  console.log(`link:${link}`);
try{
  const response = await axios.post<shortenLinkResponse>('api/shortenlink',{link});
  setStatus('success');
  setMessage(response.data?.shorten_link);
}
catch(e){
  console.log(`error:${e}`);
  const error = e as AxiosError<shortenLinkErrorResponse>;
  setStatus('error');
  setMessage(error.response.data?.error_description||"something went wrong");
}
}

  const failStatusHandle=()=>{
    const error = form.getFieldError('link');
    setMessage(error.join(" ")); 
    if(error.length>0){
      setStatus('error');
    }else{
      setStatus('info');
    }
  }
  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div className={styles.logo}></div>
      </Header>
      <Content className={styles.content}>
      <Title level={5}>Copy &amp; Paste your lengthy link</Title>
        <div className={styles.shotner}>
          <Form name="customized_form_controls"  form={form} onFinish={onFinish}>
            <div className={styles.linkfield}>
              <div className={styles.linkfieldinput}>
                <Form.Item name="link" noStyle rules={[{
                  required:true,
                  message:"Please enter the correct link",
                  type:"url"
                }]}>
                  <Input placeholder="htpps://super-big-link--blah--blah--blah.com" size="large"/>
                </Form.Item>
              </div>
              <div className={styles.linkfieldbutton}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" onClick={failStatusHandle}>
                    short!
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          {['error','success'].includes(status) && (<Alert showIcon message={message} type={status}></Alert>)}
        </div>
      </Content>
      <Footer className={styles.footer}>
        Yet another link shortner &copy; 2021
      </Footer>
    </Layout>
  );
}
