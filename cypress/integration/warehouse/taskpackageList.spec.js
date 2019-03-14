/// <reference types="Cypress" />

import { user,taskpackageList } from "../../data"

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

  describe('任务包列表测试', () => {
    it('任务包列表获取数据', () => {
      cy.visit('http://localhost:9528/#/project1/taskpackageList')
      
      cy.get('.el-table__body')
      .find('tbody tr:first')
      .find('td')
      // checking the text of the <td> element in various ways
      .should('contain', taskpackageList.tpName)
    })

    it('任务包列表--搜索功能测试', () => {

      cy.get('#taskSearch').type(taskpackageList.tpSearch)
      cy.get('.filter-container > .el-button').click()
      
      cy.get('.el-table__body')
      .find('tbody tr:first')
      .find('td')
      // checking the text of the <td> element in various ways
      .should('contain', taskpackageList.tpSearch)
    })

    it('任务包列表--@功能测试', () => {

      cy.get('.el-table_1_column_9 > .cell > .el-button--primary').click()

      // 选择作业员
      cy.get('.el-form-item__content > .el-select > .el-input > .el-input__inner').click()
      cy.get('.el-scrollbar__view > :nth-child(5)').click()

      cy.get('.el-form-item__content > .el-input > .el-input__inner').type(taskpackageList.tpAtDescribe)
      
      cy.get('.dialog-footer > .el-button--primary').click()


      cy.get('.el-table__body')
      .find('tbody tr:first')
      .find('td')
      // checking the text of the <td> element in various ways
      .should('contain', taskpackageList.tpAtSelectOperator)

      cy.get('.el-button--default').click()
    })

    it('任务包列表--查看@记录测试', () => {

      cy.get('.el-table_1_column_11 > .cell > .el-button').click()

      cy.get('.el-table__row > .el-table_3_column_18')
      // .find('tbody tr:first')
      // .find('td')
      // checking the text of the <td> element in various ways
      .should('contain', taskpackageList.tpAtSelectOperator)
    })

    it('任务包列表--管理数据测试', () => {

      cy.get('#dataMgmt').click({waitForAnimations: false})

      //获取子版本列表
      cy.get('tbody > :nth-child(1) > .el-table_4_column_22').should('contain', 'v0.0')

      cy.get('input[name="remarks"]').type(taskpackageList.uploadTaskDes)
      // 选择进度
      cy.get(':nth-child(2) > .el-form-item__content > .el-select > .el-input > .el-input__inner').click()
      cy.get('#hp3').click()

      cy.get('#browse_button > span').click()
    })

    it('任务包列表--下载测试', () => {

      cy.get('#downloadTask5').click({waitForAnimations: false})
    })
  })

})
