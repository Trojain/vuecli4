<template>
	<div class="login">
		<div class="login-box clearfix">
			<div class='login-title fl'>
				<img src="../../assets/images/logo_white.png" alt="logo">
				<p>供应链金融管理平台</p>
			</div>
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" @keyup.enter.native="submitForm('ruleForm')" class="fr">
				<i class="login-icon" :class="isAccount ? 'account-icon' : 'qrcode-icon'" @click="loginMode"></i>
				<div v-if="isAccount">
					<p class="login-mode">扫码安全登录</p>
					<div class="login-qrcode"></div>
					<p class="login-tips">使用微信扫一扫登录</p>
				</div>
				<div v-else>
					<p class="login-mode">帐号登录</p>
					<el-form-item prop="username">
						<div class="username-box">
							<i class="iconfont">&#xe639;</i>
							<el-input type="text" v-model="ruleForm.username" placeholder="请输入用户名 admin"></el-input>
						</div>
					</el-form-item>
					<el-form-item prop="password">
						<div class="password-box">
							<i class="iconfont">&#xe69f;</i>
							<el-input type="password" v-model="ruleForm.password" placeholder="请输入密码 123456"></el-input>
						</div>
					</el-form-item>
					<el-form-item prop="code">
						<div class="clearfix code-box">
							<div class="fl">
								<el-input type="text" v-model="ruleForm.code" maxlength="4" placeholder="请输入验证码 1111"></el-input>
							</div>
							<div class="fr">
								<img @click="getValidatorUrl" :src="validatorUrl" alt="点击刷新">
							</div>
						</div>
					</el-form-item>
					<div class="operate-box clearfix">
						<el-checkbox v-model="checked">请保存我这次登录信息</el-checkbox>
						<router-link to="/register" class="forget-password fr">忘记密码？</router-link>
					</div>
					<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
				</div>
				<p class="edition">当前版本 v1.0.0</p>
			</el-form>
		</div>
		<div class="login-footer">
			<p>©2017-2018&nbsp;SPEK&nbsp;版权所有&nbsp;ICP证：粤00-000000000</p>
			<p>粤公网备案&nbsp;000000000000&nbsp;号</p>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from "vuex";
import { setStore, getStore, removeStore } from 'js/store'
export default {
	name: "Login",
	data () {
		var checkName = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入用户名"));
			} else {
				callback();
			}
		};
		var checkPass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入密码"));
			} else if (value.length > 6) {
				callback(new Error("1-6个字符"));
			} else {
				callback();
			}
		};
		var checkCode = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入验证码"));
			} else if (value.length !== 4) {
				callback(new Error("验证码不正确"));
			} else {
				callback();
			}
		};
		return {
			isAccount: false,
			checked: true,
			ruleForm: {
				username: "admin",
				password: "123456",
				code: "1111"
			},
			rules: {
				username: [
					{ required: true, validator: checkName, trigger: "blur" }
				],
				password: [
					{ required: true, validator: checkPass, trigger: "blur" }
				],
				code: [
					{ required: true, validator: checkCode, trigger: "blur" }
				]
			},
			validatorUrl: null
		};
	},
	methods: {
		...mapMutations({
			set_active_index: "SET_ACTIVE_INDEX",
			set_user_info: "SET_USER_INFO"
		}),
		// 刷新验证码
		getValidatorUrl () {
			const fileIpService = getStore({
				name: "fileIpService",
				type: "object"
			});
			this.validatorUrl = fileIpService.ip + fileIpService.loginValidator + "?t=" + Math.random();
		},
		loginMode () {
			this.isAccount = !this.isAccount
		},
		submitForm (formName) {
			this.getValidatorUrl();
			// 以下为正常登录
			this.$refs[formName].validate(valid => {
				if (valid) {
					removeStore({ name: 'access_token' });
					// this.axios.post("/api/oauth-service/user/login", {
					// 	username: this.ruleForm.username,
					// 	password: this.ruleForm.password
					// }).then((res) => {
					// 	// eslint-disable-next-line eqeqeq
					// 	if (res.statusCode == 200) {
					// console.log(res.data)
					this.$message.success("登录成功");
					// 保存token
					setStore({
						name: 'access_token',
						// content: res.data.access_token
						content: 'res.data.access_token'
					});
					// 保存用户信息
					this.set_user_info('res.data');
					// 切换到用户保存的路由
					console.log(this.$router.currentRoute.query.redirect);
					if (this.$router.currentRoute.query.redirect) {
						this.$router.push(this.$router.currentRoute.query.redirect);
					} else {
						this.$router.push("/");
					}
					this.set_active_index("/");
					// }
					// });
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		}
	},
	activated () {
		this.getValidatorUrl();
	}
};
</script>

<style scoped lang="stylus">
.login
	background url('../../assets/images/login_bg.png') 0 0 no-repeat
	background-size cover
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	// .login-header
	// background rgba(0, 0, 0, 0.4)
	// height 88px
	// width 100%
	// img
	// margin 26px 100px
	.login-box
		margin 0 16.66%
		transform translate(0, -50%)
		position relative
		top 50%
		@media screen and (min-width 1020px) and (max-width 1280px)
			margin 0 10%
		.login-title
			margin 177px 0
			img
				width 320px
			p
				font-size 32px
				color #fff
				margin-top 30px
		.el-form
			width 460px
			height 456px
			padding 0 50px
			box-sizing border-box
			background #fff
			position relative
			@media screen and (max-width 1440px)
				width 380px
			.login-icon
				width 50px
				height 50px
				display inline-block
				cursor pointer
				position absolute
				top 20px
				right 20px
			.account-icon
				background url('../../assets/images/icon_login_account.png') 0 0 no-repeat
			.qrcode-icon
				background url('../../assets/images/icon_login_QRcode.png') 0 0 no-repeat
			.login-mode
				padding 30px 0
				font-size 20px
				color #409eff
				line-height 20px
				text-align center
				cursor pointer
			.login-qrcode
				width 200px
				height 200px
				background #ccc
				margin 30px auto 20px
			.login-tips
				color #999999
				font-size 14px
				text-align center
				margin-bottom 66px
			>>>.el-form-item
				margin-bottom 30px
			>>>.el-input__inner:focus
				border-color #00438a
			.username-box, .password-box
				position relative
				.iconfont
					position absolute
					padding 0 15px
					z-index 2
					color #c6d3de
					font-size 13px
					line-height 43px
				>>>input
					padding-left 40px
			.code-box
				.fl
					width 220px
					@media screen and (max-width 1440px)
						width 150px
				.fr
					width 100px
					height 40px
					border 1px solid #dcdfe6
					img
						width 100%
						cursor pointer
			.operate-box
				margin-bottom 22px
				>>>.el-checkbox__label
					font-size 16px
					color #333333
					line-height 16px
				>>>.el-checkbox__inner
					width 20px
					height 20px
					&:after
						position absolute
						height 9px
						width 4px
						left 6px
						top 2px
				>>>.el-checkbox__input.is-checked .el-checkbox__inner
					background-color #00438a
					border-color #00438a
				>>>.el-checkbox__input.is-focus .el-checkbox__inner
					border-color #00438a
				.forget-password
					font-size 16px
					color #00438a
					line-height 16px
			.el-button
				width 100%
				background #00438a
				box-shadow 1px 2px 4px 0 #00438a
				border-radius 4px
				border-color #00438a
				font-size 16px
				color #fff
			.edition
				font-size 14px
				color #666666
				line-height 14px
				text-align center
				margin-top 30px
	.login-footer
		position fixed
		bottom 30px
		text-align center
		width 100%
		p
			color #fff
			font-size 14px
			line-height 22px
</style>