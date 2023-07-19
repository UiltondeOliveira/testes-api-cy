/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request('usuarios').then(response => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(15)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let varicao = `${Math.floor(Math.random() * 1000)}`
          let nome = `Aluno EBAC ` + varicao
          let email = `ebac.aluno` + varicao + `@qa.com.br`
          let admin = `${Math.random() >= 0.5}`

          cy.cadastrarUsuario(nome, email, "teste", admin)
               .then(response => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario("Fulano da Silva", "beltrano@qa.com.br", "teste", "true")
               .then(response => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.log(id)
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                         "nome": "Uilton Oliveira",
                         "email": "uilton.oliveira@qa.com.br",
                         "password": "teste",
                         "administrador": "false"
                    }
               }).then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let varicao = `${Math.floor(Math.random() * 1000)}`
          let nome = `Aluno EBAC ` + varicao
          let email = `ebac.aluno` + varicao + `@qa.com.br`
          let admin = `${Math.random() >= 0.5}`

          cy.cadastrarUsuario(nome, email, "teste", admin).then(response => {
               let id = response.body._id

               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
               }).then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
               })
          })
     });
});
