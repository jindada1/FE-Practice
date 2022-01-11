

## 业务

### 跨域

协议 + 域名 + 端口号均相同，那么就是同域，[参考](https://www.jianshu.com/p/f880878c1398)



#### JSONP

本质上是利用 `<script><img><iframe>` 等标签不受同源策略限制，可以从不同域加载并执行资源的特性，来实现数据跨域传输

与服务端约定好一个回调函数名，服务端接收到请求后，将返回一段 Javascript，在这段  Javascript 代码中调用了约定好的回调函数，并且将数据作为参数进行传递。当网页接收到这段 Javascript 代码后，就会执行这个回调函数，这时数据已经成功传输到客户端了。

优点：它的兼容性更好，在更加古老的浏览器中都可以运行。

缺点：它只支持 GET 请求，而不支持 POST 请求等其他类型的 HTTP 请求



#### CORS

跨源资源共享 **Cross-Origin Resource Sharing(CORS)** 是一个新的 W3C 标准

它新增的一组HTTP首部字段，允许服务端其声明哪些网站访问哪些资源

浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）



### 前端鉴权

https://juejin.cn/post/6898630134530752520

#### 服务端 session

站在服务端的角度看，服务端要为每个正在访问的客户端创建一个会话（session）用于保存该客户端的状态。

每个会话都有一个独一无二的标识符 `sessionId` 用于与客户端一一对应，在给客户端的响应头中把 `sessionId` 设置在 cookie 里。

当有客户端访问服务端时，服务端就可以通过 cookie 中的 sessionId 获取访问 session 对象找到对应的客户状态。



#### Token

session 的维护给服务端造成很大困扰，我们必须找地方存放它，又要考虑分布式的问题，甚至要单独为了它启用一套 Redis 集群。有没有更好的办法？

把用户信息编码加密后，再加上数字签名，得到的字符串就是 token，该 token 存到客户端的 cookie 中。之后服务端处理请求的时候，验证并解码 token 就能知道请求对应的用户信息，然后进行正常的业务处理。服务器不保存任何 session ，也就是说，服务器变成无状态了，从而比较容易实现扩展。

**access token**：业务接口用来鉴权的 token。对于敏感业务，希望 access token 有效期短一点，以避免被盗用，但过短的有效期会造成 access token 经常过期，用户手动登录重新获取体验不好，于是有了下面这位：

**refresh token**：专门获取 **access token **的，有效期可以长一些，通过独立服务和严格的请求方式增加安全性



#### JWT

全称 Json Web Token，定义了一种安全传递 JSON 信息的方式，是目前最流行的跨域认证解决方案。[参考](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。

```javascript
{
  "姓名": "张三",
  "角色": "管理员",
  "到期时间": "2018年7月1日0点0分"
}
```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名。

实际的 JWT 是一个很长的字符串，中间用点（`.`）分隔成三个部分：`[Header].[Payload].[Signature]`

![jwt](readme/JWT.awebp)


#### SSO 单点登录

当业务线越来越多，把不同的业务系统分散到不同域名下，就需要「一次登录，全线通用」的能力，叫做「单点登录」。[参考](https://juejin.cn/post/6898630134530752520#heading-9)

浏览器具有严格的跨域限制，这种场景下，我们需要独立的认证服务，通常被称为 SSO。


![sso](readme/SSO.awebp)

图中我们通过颜色把浏览器当前所处的域名标记出来。注意图中灰底文字说明部分的变化。

- 在 SSO 域下，SSO 不是通过接口把 ticket 直接返回，而是通过一个带 code 的 URL 重定向到系统 A 的接口上，这个接口通常在 A 向 SSO 注册时约定
- 浏览器被重定向到 A 域下，带着 code 访问了 A 的 callback 接口，callback 接口通过 code 换取 ticket
- 这个 code 不同于 ticket，**code 是一次性的，暴露在 URL 中，只为了传一下换 ticket，换完就失效**
- callback 接口拿到 ticket 后，在自己的域下 set cookie 成功
- 在后续请求中，只需要把 cookie 中的 ticket 解析出来，去 SSO 验证就好
- 访问 B 系统也是一样

**逻辑**：SSO 验证通过后，生成一个 `code` 重定向到业务域下，业务域后台验证这个 `code` 来生成用户在当前域下的 `ticket`

