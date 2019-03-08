
/// <reference types="Cypress" />

import { user,scheduleList } from "../../data"

context('全生命周期管理系统测试', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('Admin-Token')
  })

  describe('登录测试', () => {
    it('测试登录成功后是否跳转主页', () => {

      cy.visit('http://localhost:9528/#/login')

      cy.get('input[name="username"]').type(user.name)
      cy.get('input[name="password"]').type(user.password)
      cy.get('.el-button').click()

      // ensure the login page sends you home after login
      cy.url().should('contain', '/home')
    })
  })

  describe('进度管理测试', () => {
    it('进度管理获取数据', () => {
      cy.visit('http://localhost:9528/#/adminMgmt/scheduleMgmt1')

      cy.get('.el-table__body')
        .find('tbody tr:first')
        .find('td')
        // checking the text of the <td> element in various ways
        .should('contain', scheduleList.scheduleName)
    })

    it('进度管理添加进度&搜索进度', () => {

      cy.get('#addSchedule').click()

      // 添加进度
      cy.get('.el-form-item__content > .el-input > .el-input__inner').type(scheduleList.addSchedule)

      cy.get('.dialog-footer > .el-button--primary').click()

      // 搜索进度
      cy.get('.filter-container > .el-input > .el-input__inner').type(scheduleList.addSchedule)

      cy.get('.filter-container > :nth-child(2)').click()

      cy.get('.el-table__body')
        .find('tbody tr:first')
        .find('td')
        // checking the text of the <td> element in various ways
        .should('contain', scheduleList.addSchedule)
    })

    it('进度管理修改进度', () => {
      // 修改进度
      cy.wait(500)
      cy.get(scheduleList.editBtnId).click()
  
      cy.get('.el-form-item__content > .el-input > .el-input__inner').type(scheduleList.editSchedule)
  
      cy.get('.dialog-footer > .el-button--primary').click()
  
      cy.get('.el-table__body')
        .find('tbody tr:first')
        .find('td')
        // checking the text of the <td> element in various ways
        .should('contain', scheduleList.editScheduleTest)
    })
  
    it('进度管理删除进度', () => {
      // 删除进度
      cy.get(scheduleList.DelBtnId).click()
    })
  })
})
