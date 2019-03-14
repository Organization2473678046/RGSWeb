
/// <reference types="Cypress" />

import { user, projectList } from "../../data"

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

  describe('任务包统计图表测试', () => {
    it('项目管理获取数据', () => {
      cy.visit('http://localhost:9528/#/project1/taskPackageStatistics')

      cy.get('.el-input__inner').click()

      cy.get('.el-scrollbar__view > :nth-child(2)').click()
    })
  })
})
