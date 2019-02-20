/// <reference types="Cypress" />

context('登录测试', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9528/#/login')
  })

  // https://on.cypress.io/interacting-with-elements

  it('.type() - type into a DOM element', () => {
    // 登录
    cy.get('input[name="username"]').eq(0).type('root')
    cy.get('input[name="password"]').eq(0).type('root12345')
    cy.get('.el-button').click()

    // 打开左侧菜单-任务包列表
    cy.get('.hamburger-container').click()

    cy.get(':nth-child(3) > :nth-child(1) > [style="padding-left: 20px; color: rgb(191, 203, 217); background-color: rgb(48, 65, 86);"]').click()

    cy.get('[href="#/project1/taskpackageList"] > .el-menu-item > span').click()

    // 搜索
    cy.wait(500)
    cy.get('.filter-container > .el-input > .el-input__inner').eq(0).type('河网环修改')
    cy.wait(200)
    cy.get('.filter-container > .el-button').click()

    // @功能
    cy.wait(500)
    cy.get(':nth-child(1) > .el-table_1_column_9 > .cell > .el-button--primary').click()
    // cy.get('.el-form-item__content > .el-select > .el-input > .el-input__inner').select('作业员5')
    cy.get('.el-form-item__content > .el-select > .el-input > .el-input__inner').click()
    cy.get(':nth-child(4) > span').click()
    cy.get('.el-form-item__content > .el-input > .el-input__inner').eq(0).type('测试指定作业员')
    cy.wait(500)
    cy.get('.dialog-footer > .el-button--primary').click()

    // 查看@记录
    // cy.get(':nth-child(2) > .el-table_1_column_11 > .cell > .el-button').click()
    cy.wait(1000)
    cy.get('.current-row > .el-table_1_column_11 > .cell > .el-button').click()
  })
})
