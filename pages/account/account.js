// pages/account/account.js
const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

const db = wx.cloud.database();
const userCollection = db.collection('user');

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: "红薯宝宝"
  },
  onLoad() {
    let _this = this;
    // 先从缓存中拿，拿不到再向数据库发起请求
    wx.getStorage({
      key: 'nickname',
      success(res) {
        _this.setData({nickname: res.data})
      },
      fail(err){
        userCollection.get().then(res => {
          _this.setData({nickname: res.data[0].nickname})
        })  
      }
    })
    wx.getStorage({
      key: 'avatarUrl',
      success(res) {
        _this.setData({avatarUrl: res.data})
      },
      fail(err){
        userCollection.get().then(res => {
          _this.setData({avatarUrl: res.data[0].avatarUrl})
        })  
      }
    })
  },
  onChooseAvatar(e) {
    console.log(e);
    let avatarUrl = e.detail.avatarUrl;
    this.setData({
      avatarUrl: avatarUrl
    })
    // 保存在缓存中
    wx.setStorage({
      key: 'avatarUrl',
      data: avatarUrl
    })
    // 更新在数据库中
    const db = wx.cloud.database();
    const userCollection = db.collection('user');
    userCollection.get().then(res => {
      userCollection.doc(res.data[0]._id).update({
        data: {
          avatarUrl: avatarUrl
        }
      }).then(res => {
        console.log(res);
      })
    })
  },
  inputBlur(e) {
    let nickname = e.detail.value;
    this.setData({
      nickname: nickname
    })
    // 保存在缓存中
    wx.setStorage({
      key: 'nickname',
      data: nickname
    })
    // 更新在数据库中
    const db = wx.cloud.database();
    const userCollection = db.collection('user');
    userCollection.get().then(res => {
      userCollection.doc(res.data[0]._id).update({
        data: {
          nickname: nickname
        }
      }).then(res => {
        console.log(res);
      })
    })
  },
  onClickBackBtn() {
    wx.navigateBack();
  }
})