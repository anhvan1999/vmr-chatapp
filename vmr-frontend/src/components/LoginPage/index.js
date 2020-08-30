import React, {useState} from 'react';
import {Form, Input, Button, Row, Col, Card, Alert, Checkbox} from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import bg from '../resource/registerbg.jpg';
import {usernamePasswordLogin} from "../../service/login";

const rowStyle = {
  minHeight: "100vh",
  backgroundImage: `url(${bg})`,
  backgroundSize: 'cover'
}

const colStyle = {
  border: '1px solid #e2dede',
  padding: '12px',
  borderRadius: '4px',
  marginTop: "10vh",
  marginBottom: "10vh",
  backgroundColor: "white"
};

function LoginPage(props) {
  let [form] = Form.useForm();
  let [error, setError] = useState(false);

  let hanldeLoginForm = (event) => {
    usernamePasswordLogin(event.username, event.password).then(() => {
      props.history.push('/');
    }).catch(() => {
      form.resetFields();
      setError(true);
    });
  };


  let cleanMsg = (event) => {
    setError(false);
  };

  let msg = null;
  if (error) {
    msg = <Alert
      message="Đăng nhập không thành công"
      type="error"
      showIcon
    />;
  }

  return (
    <Row style={rowStyle} align="top">
      <Col xs={{span: 22, offset: 1}} sm={{span: 16, offset: 4}} md={{span: 10, offset: 7}} lg={{span:8, offset:8}} style={colStyle}>
        <h1 style={{textAlign: "center"}}>Login</h1>
        <Card bordered={false}>
          <Form form={form}
                onFinish={hanldeLoginForm}
                className="login-form"
                name="basic"
                initialValues={{remember: true}}
                onFieldsChange={cleanMsg}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}

            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a style={{float: "right"}} href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                Log in
              </Button>
              Or <a href="">register now!</a>
            </Form.Item>
          </Form>
          {msg}
        </Card>
      </Col>
    </Row>
  );
}

export default LoginPage;
