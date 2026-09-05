# Atendimento é o único agregado

A ONG faz trabalhos distintos e a mesma pessoa pode voltar. Unicidade real (foto/face) ficou para depois. CPF e nome são opcionais, então “pessoa distinta” mentiria no dashboard.

Decidimos que o único agregado gravado é o **Atendimento**. Não há cadastro de Pessoa atendida. Atividade é cadastro auxiliar (CRUD) ao qual o Atendimento se refere por identidade. O total exibido é quantidade de Atendimentos, inclusive anônimos.

Alternativas rejeitadas: cadastro de pessoa atualizado a cada retorno (apaga o retrato do encontro); KPI de pessoas distintas por CPF no MVP (CPF opcional e reincidente infla ou esconde).
