
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

  describe('项目管理测试', () => {
    it('项目管理获取数据', () => {
      cy.visit('http://localhost:9528/#/adminMgmt/projectMgmt')

      cy.get('.el-table__body')
        .find('tbody tr:first')
        .find('td')
        // checking the text of the <td> element in various ways
        .should('contain', projectList.projectName)
    })

    it('项目管理创建项目&搜索项目', () => {

      cy.get('#createProject').click()

      // 创建项目
      cy.get('.el-form-item__content > .el-input > .el-input__inner').type(projectList.createProject)
      cy.get('.el-textarea__inner').type(projectList.createProjectDes)

      cy.get('.dialog-footer > .el-button--primary').click()

      // 搜索项目
      cy.get('.filter-container > .el-input > .el-input__inner').type(projectList.createProject)

      cy.get('.filter-container > :nth-child(2)').click()

      cy.get('.el-table__body')
        .find('tbody tr:first')
        .find('td')
        // checking the text of the <td> element in various ways
        .should('contain', projectList.createProject)
    })

    it('上传项目GDB文件', () => {

    })
  })
})
