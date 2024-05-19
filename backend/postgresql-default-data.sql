-- Inserir usuários
INSERT INTO users (name, email, password, email_verified_at, created_at, updated_at) VALUES
('João', 'admin@example.com', 'atec123', NOW(), NOW(), NOW()),
('David', 'coo@example.com', 'atec123', NOW(), NOW(), NOW()),
('Gonçalo', 'cola@example.com', 'atec123', NOW(), NOW(), NOW());

-- Inserir roles
INSERT INTO roles (role_name, created_at, updated_at) VALUES
('Admin', NOW(), NOW()),
('Coordenador', NOW(), NOW()),
('Colaborador', NOW(), NOW());

-- Associar usuários a roles
INSERT INTO user_role (user_id, role_id) VALUES
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM roles WHERE role_name = 'Admin')),  
((SELECT id FROM users WHERE email = 'gestor@example.com'), (SELECT id FROM roles WHERE role_name = 'Coordenador')),  
((SELECT id FROM users WHERE email = 'consultor@example.com'), (SELECT id FROM roles WHERE role_name = 'Colaborador'));  

-- Inserir services
INSERT INTO services (service_name, created_at, updated_at) VALUES
('Consulta Externa', NOW(), NOW()),
('Internamento Agudos', NOW(), NOW()),
('Internamento Trofa Saúde', NOW(), NOW()),
('Internamento Crónicos', NOW(), NOW()),
('Serviço Domiciliário', NOW(), NOW()),
('Hospital Dia', NOW(), NOW());

-- Inserir activities
INSERT INTO activities (activity_name, created_at, updated_at) VALUES 
('Psiquiatria Infância e Adolescência', NOW(), NOW()),
('Psiquiatria Adultos', NOW(), NOW()),
('Quadro Resumo', NOW(), NOW());

-- Inserir indicadores
INSERT INTO indicators (indicator_name, created_at, updated_at) VALUES
('Nº Consultas Total', NOW(), NOW()), -- 1
('Primeiras Consultas', NOW(), NOW()), -- 2
('Consultas Subsequentes', NOW(), NOW()), -- 3
('% Primeiras Consultas / Total', NOW(), NOW()), -- 4
('% Consultas Marcadas e não Realizadas', NOW(), NOW()), -- 5
('Encargos Globais', NOW(), NOW()), -- 6
('Encargos / Consultas', NOW(), NOW()), -- 7
('Encargo Consulta / Doente', NOW(), NOW()), -- 8
('Nº de 1ªs Consultas Médicas', NOW(), NOW()), -- 9
('Nº de Consultas Médicas Subsequentes', NOW(), NOW()), -- 10
('N.º Total Consultas Médicas', NOW(), NOW()), -- 11
('Lotação', NOW(), NOW()), -- 12
('Demora Média', NOW(), NOW()), -- 13
('Taxa de Ocupação', NOW(), NOW()), -- 14
('Taxa de Reinternamento (30 dias)', NOW(), NOW()), -- 15
('Índice Case-Mix', NOW(), NOW()), -- 16
('Doentes Saídos (Altas)', NOW(), NOW()), -- 17
('Doentes Saídos P/Cama', NOW(), NOW()), -- 18
('Encargos (rubricas)', NOW(), NOW()), -- 19
('Encargos / Doentes Saídos', NOW(), NOW()), -- 20
('Doentes de Psiquiatria no Exterior (Trofa Saúde)', NOW(), NOW()), -- 21
('Total dias de internamentos', NOW(), NOW()), -- 22
('Preço de referência para diária (1)', NOW(), NOW()), -- 23
('Dias de Internamento (Totais) Doentes Crónicos', NOW(), NOW()), -- 24
('Demora média Crónicos(HPA)', NOW(), NOW()), -- 25
('Demora média Crónicos (Santa Casa Misericórdia Amarante)', NOW(), NOW()), -- 26
('Doentes de Psiquiatria Crónicos (HPA)', NOW(), NOW()), -- 27
('Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)', NOW(), NOW()), -- 28
('Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)', NOW(), NOW()), -- 29
('Nº Sessões Total', NOW(), NOW()), -- 30
('Nº Doentes', NOW(), NOW()), -- 31
('Nº Sessões / Doente', NOW(), NOW()), -- 32
('Encargos/Sessão', NOW(), NOW()), -- 34
('Total de Visitas Domiciliárias', NOW(), NOW()), -- 35
('Encargos/Visita', NOW(), NOW()), -- 36
('Consultas Marcadas e não Realizadas', NOW(),NOW()), --37
('Ocupacão', NOW(),NOW())
; --38

DELETE FROM indicators WHERE id = 38;


SELECT id  FROM indicators;


SELECT * FROM service_activity_indicators WHERE
service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND
activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND
indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas');

SELECT * FROM service_activity_indicators;

DELETE FROM service_activity_indicators WHERE id = 118;

-- Psiquiatria Adultos
INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) values
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = 'Nº Consultas Total'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes'), 'produção'),
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas'), 'produção'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = '% Primeiras Consultas / Total'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = '% Consultas Marcadas e não Realizadas'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais'), 'financeiro'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Consultas'), 'financeiro'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos'), (SELECT id FROM indicators WHERE indicator_name = 'Encargo Consulta / Doente'), 'financeiro');

-- Psiquiatria Infância e Adolescência
INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) VALUES
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = 'Nº Consultas Total'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas'), 'produção'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = '% Primeiras Consultas / Total'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = '% Consultas Marcadas e não Realizadas'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais'), 'financeiro'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Consultas'), 'financeiro'), 
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência'), (SELECT id FROM indicators WHERE indicator_name = 'Encargo Consulta / Doente'), 'financeiro');

-- Quadro Resumo
INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) VALUES
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo'), (SELECT id FROM indicators WHERE indicator_name = 'Nº de 1ªs Consultas Médicas'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo'), (SELECT id FROM indicators WHERE indicator_name = 'Nº de Consultas Médicas Subsequentes'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Consulta Externa'), (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo'), (SELECT id FROM indicators WHERE indicator_name = 'N.º Total Consultas Médicas'), 'produção');

-- Internamento Agudos
INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) VALUES
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Lotação'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Demora Média'), 'produção'),  
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Taxa de Ocupação'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Ocupacão'), 'produção'),   
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Taxa de Reinternamento (30 dias)'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Índice Case-Mix'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Doentes Saídos (Altas)'), 'produção'),   
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Doentes Saídos P/Cama'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Encargos (rubricas)'), 'financeiro'), 
((SELECT id FROM services WHERE service_name = 'Internamento Agudos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Doentes Saídos'), 'financeiro');

-- Internamento Trofa Saúde
INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) VALUES
((SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Trofa Saúde)'), 'produção'),   
((SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Total dias de internamentos'), 'produção'),   
((SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Preço de referência para diária (1)'), 'financeiro'), 
((SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Doentes Saídos'), 'financeiro');

-- Internamento Crónicos
INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) VALUES
((SELECT id FROM services WHERE service_name = 'Internamento Crónicos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Dias de Internamento (Totais) Doentes Crónicos'), 'produção'), 
((SELECT id FROM services WHERE service_name = 'Internamento Crónicos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos(HPA)'), 'produção'), 
((SELECT id FROM services WHERE service_name = 'Internamento Crónicos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos (Santa Casa Misericórdia Amarante)'), 'produção'), 
((SELECT id FROM services WHERE service_name = 'Internamento Crónicos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (HPA)'), 'produção'), 
((SELECT id FROM services WHERE service_name = 'Internamento Crónicos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)'), 'produção'), 
((SELECT id FROM services WHERE service_name = 'Internamento Crónicos'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)'), 'produção');

-- Hospital Dia
INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) VALUES
((SELECT id FROM services WHERE service_name = 'Hospital Dia'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Nº Sessões Total'), 'produção'),   
((SELECT id FROM services WHERE service_name = 'Hospital Dia'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Nº Doentes'), 'produção'),   
((SELECT id FROM services WHERE service_name = 'Hospital Dia'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Nº Sessões / Doente'), 'desempenho'), 
((SELECT id FROM services WHERE service_name = 'Hospital Dia'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Sessão'), 'financeiro');

INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) VALUES
((SELECT id FROM services WHERE service_name = 'Hospital Dia'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais'), 'financeiro');


-- Serviço Domiciliário
INSERT INTO service_activity_indicators (service_id, activity_id, indicator_id, type) VALUES
((SELECT id FROM services WHERE service_name = 'Serviço Domiciliário'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Total de Visitas Domiciliárias'), 'produção'),   
((SELECT id FROM services WHERE service_name = 'Serviço Domiciliário'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais'), 'financeiro'), 
((SELECT id FROM services WHERE service_name = 'Serviço Domiciliário'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Visita'), 'financeiro');

-- Inserir valores na tabela records para Psiquiatria Adultos 
INSERT INTO records (service_activity_indicator_id, value, date) VALUES					
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 500, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 5000, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas')), 633, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Consultas')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargo Consulta / Doente')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 606, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 355, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas')), 633, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Consultas')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargo Consulta / Doente')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 509, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 5000, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas')), 600, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Consultas')), 0, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargo Consulta / Doente')), 0, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 500, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 162, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas')), 600, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Consultas')), 0, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargo Consulta / Doente')), 0, '2024-02-28');

-- Inserir valores na tabela records para Psiquiatria Infância e Adolescência 
INSERT INTO records (service_activity_indicator_id, value, date) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 275, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 500, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas')), 286, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 300, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 496, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas')), 100, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 244, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 500, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas')), 286, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 200, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 699, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Marcadas e não Realizadas')), 100, '2024-02-28');

-- Inserir valores na tabela records para Quadro Resumo 
INSERT INTO records (service_activity_indicator_id, value, date) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de 1ªs Consultas Médicas')), 681, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de Consultas Médicas Subsequentes')), 6000, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de 1ªs Consultas Médicas')), 1000, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de Consultas Médicas Subsequentes')), 351, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de 1ªs Consultas Médicas')), 453, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de Consultas Médicas Subsequentes')), 6000, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de 1ªs Consultas Médicas')), 1000, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de Consultas Médicas Subsequentes')), 361, '2024-02-28');

-- Inserir valores na tabela records para Internamento Agudos 
INSERT INTO records (service_activity_indicator_id, value, date) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Lotação')), 21, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora Média')), 10, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Ocupacão')), 28, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Taxa de Reinternamento (30 dias)')), 1.5, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Índice Case-Mix')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes Saídos (Altas)')), 66, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes Saídos P/Cama')), 1.6, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos (rubricas)')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Doentes Saídos')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Lotação')), 20, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora Média')), 7.8, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Ocupacão')), 10, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Taxa de Reinternamento (30 dias)')), 6, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Índice Case-Mix')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes Saídos (Altas)')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes Saídos P/Cama')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos (rubricas)')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Doentes Saídos')), 0, '2023-02-28');

-- Inserir valores na tabela records para Internamento Trofa Saúde 
INSERT INTO records (service_activity_indicator_id, value, date) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Trofa Saúde)')), 2, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total dias de internamentos')), 57, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Preço de referência para diária (1)')), 89.00, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Doentes Saídos')), 9333.00, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Trofa Saúde)')), 2, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total dias de internamentos')), 40, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Preço de referência para diária (1)')), 100, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos / Doentes Saídos')), 9000.00, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Trofa Saúde)')), 22, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total dias de internamentos')), 676, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Preço de referência para diária (1)')), 115.00, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Trofa Saúde)')), 100, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total dias de internamentos')), 2000, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Trofa Saúde') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Preço de referência para diária (1)')), 100.00, '2024-02-28');

-- Inserir valores na tabela records para Internamento Crónicos
INSERT INTO records (service_activity_indicator_id, value, date) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Dias de Internamento (Totais) Doentes Crónicos')), 500, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos(HPA)')), 38, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos (Santa Casa Misericórdia Amarante)')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (HPA)')), 4, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)')), 10, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Dias de Internamento (Totais) Doentes Crónicos')), 533, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos(HPA)')), 100, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos (Santa Casa Misericórdia Amarante)')), 2, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (HPA)')), 3, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)')), 13, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Dias de Internamento (Totais) Doentes Crónicos')), 1000, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos(HPA)')), 40, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos (Santa Casa Misericórdia Amarante)')), 2, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (HPA)')), 4, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)')), 10, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)')), 0, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Dias de Internamento (Totais) Doentes Crónicos')), 1203, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos(HPA)')), 35, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos (Santa Casa Misericórdia Amarante)')), 0, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (HPA)')), 2, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria Crónicos (Santa Casa Misericórdia Amarante)')), 13, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Doentes de Psiquiatria no Exterior (Ordens Religiosas e Outras Entidades)')), 0, '2024-02-28');

-- Inserir valores na tabela records para Hospital Dia
INSERT INTO records (service_activity_indicator_id, value, date) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Sessões Total')), 1700, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Doentes')), 500, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Sessão')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Sessões Total')), 1000, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Doentes')), 601, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Sessão')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Sessões Total')), 1500, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Doentes')), 500, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Sessão')), 0, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Sessões Total')), 1000, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Doentes')), 512, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Sessão')), 0, '2024-02-28');

-- Inserir valores na tabela records para Serviço Domiciliário
INSERT INTO records (service_activity_indicator_id, value, date) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total de Visitas Domiciliárias')), 187, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Visita')), 0, '2023-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total de Visitas Domiciliárias')), 1000, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Visita')), 0, '2023-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total de Visitas Domiciliárias')), 171, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Visita')), 0, '2024-01-31'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total de Visitas Domiciliárias')), 1000, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos Globais')), 0, '2024-02-28'),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND activity_id IS NULL AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Visita')), 0, '2024-02-28');

-- Criar VIEW vw_indicator_accumulated
CREATE OR REPLACE VIEW vw_indicator_accumulated AS
SELECT
    sai.service_id,
    sai.activity_id,
    i.indicator_name,
    EXTRACT(YEAR FROM r.date) AS year,
    EXTRACT(MONTH FROM r.date) AS month,
    SUM(r.value) AS value_accumulated
FROM
    records r
JOIN
    service_activity_indicators sai ON r.service_activity_indicator_id = sai.id
JOIN
    indicators i ON sai.indicator_id = i.id
GROUP BY
    sai.service_id, sai.activity_id, i.indicator_name, year, month;

-- View monthly
CREATE OR REPLACE VIEW vw_goals_monthly AS
SELECT
    g.service_activity_indicator_id,
    sai.service_id,
    sai.activity_id,
    g.year,
    EXTRACT(MONTH FROM r.date) AS month,
    (g.target_value / 12) * EXTRACT(MONTH FROM r.date) AS monthly_target,
    i.indicator_name,
    SUM(r.value) AS value_accumulated
FROM
    goals g
JOIN
    service_activity_indicators sai ON g.service_activity_indicator_id = sai.id
JOIN
    indicators i ON sai.indicator_id = i.id
LEFT JOIN
    records r ON r.service_activity_indicator_id = g.service_activity_indicator_id AND EXTRACT(YEAR FROM r.date) = g.year
GROUP BY
    g.service_activity_indicator_id, sai.service_id, sai.activity_id, g.year, EXTRACT(MONTH FROM r.date), i.indicator_name, g.target_value

UNION all
SELECT
    NULL AS service_activity_indicator_id,
    NULL AS service_id,
    NULL AS activity_id,
    g.year,
    EXTRACT(MONTH FROM r.date) AS month,
    (SUM(g.target_value) / 12) * EXTRACT(MONTH FROM r.date) AS meta_mensal,
    'Nº Total Consultas Médicas' AS indicator_name,
    SUM(r.value) AS total_acumulado
FROM
    goals g
JOIN
    service_activity_indicators sai ON g.service_activity_indicator_id IN (19, 20)
JOIN
    indicators i ON sai.indicator_id = i.id 
LEFT JOIN
    records r ON r.service_activity_indicator_id IN (19, 20) AND EXTRACT(YEAR FROM r.date) = g.year
WHERE
    g.service_activity_indicator_id IN (19, 20)
GROUP BY
    g.year, EXTRACT(MONTH FROM r.date)

UNION ALL
SELECT
    NULL AS service_activity_indicator_id,
    NULL AS service_id,
    NULL AS activity_id,
    g.year,
    EXTRACT(MONTH FROM r.date) AS month,
    ((SELECT target_value FROM goals WHERE service_activity_indicator_id = 43) * (SELECT target_value FROM goals WHERE service_activity_indicator_id = 44) / 12) * EXTRACT(MONTH FROM r.date) AS meta_mensal,
    'Nº Sessões Total' AS indicator_name,
    SUM(r.value) AS total_acumulado
FROM
    goals g
JOIN
    service_activity_indicators sai ON g.service_activity_indicator_id IN (43, 44)
JOIN
    indicators i ON sai.indicator_id = i.id 
LEFT JOIN
    records r ON r.service_activity_indicator_id IN (43, 44) AND EXTRACT(YEAR FROM r.date) = g.year
WHERE
    g.service_activity_indicator_id IN (43, 44)
GROUP BY
    g.year, EXTRACT(MONTH FROM r.date);

-- Final VIEW vw_variation_rate
CREATE OR REPLACE VIEW vw_variation_rate AS
SELECT
    vf1.service_id,
    vf1.activity_id,
    vf1.indicator_name,
    vf1.year AS year1,
    vf2.year AS year2,
    vf1.month,
    vf1.value_accumulated AS total_accumulated_year1,
    vf2.value_accumulated AS total_accumulated_year2,
    vf2.value_accumulated - vf1.value_accumulated AS variation_rate_homologous_abs,
    ROUND(CAST(((vf2.value_accumulated - vf1.value_accumulated) / NULLIF(vf1.value_accumulated, 0)) * 100 AS numeric), 2) AS variation_rate_homologous,
    gm1.monthly_target AS monthly_target_year1,
    gm2.monthly_target AS monthly_target_year2,
    gm2.monthly_target - gm1.monthly_target AS variation_rate_contractual_abs,
    ROUND(CAST(((gm2.monthly_target - gm1.monthly_target) / NULLIF(gm1.monthly_target, 0)) * 100 AS numeric), 2) AS variation_rate_contractual
FROM
    vw_indicator_accumulated vf1
JOIN
    vw_indicator_accumulated vf2 ON vf1.service_id = vf2.service_id
        AND vf1.activity_id = vf2.activity_id
        AND vf1.indicator_name = vf2.indicator_name
        AND vf1.month = vf2.month
JOIN
    vw_goals_monthly gm1 ON vf1.service_id = gm1.service_id
        AND vf1.activity_id = gm1.activity_id
        AND vf1.indicator_name = gm1.indicator_name
        AND vf1.year = gm1.year
        AND vf1.month = gm1.month
JOIN
    vw_goals_monthly gm2 ON vf2.service_id = gm2.service_id
        AND vf2.activity_id = gm2.activity_id
        AND vf2.indicator_name = gm2.indicator_name
        AND vf2.year = gm2.year
        AND vf2.month = gm2.month
WHERE
    vf1.year = 2023 -- Primeiro ano de comparação
    AND vf2.year = 2024 -- Segundo ano de comparação
    AND gm1.year = 2023 -- Primeiro ano de metas
    AND gm2.year = 2024
    ; -- Segundo ano de metas
    
    
    
--- view summary
CREATE OR REPLACE VIEW vw_indicator_summary AS
SELECT
    s.service_name AS "Serviço",
    a.activity_name AS "Atividade",
    i.indicator_name AS "Indicador",
    va.year AS "Ano",
    va.month AS "Mês",
    va.value_accumulated AS "Valor_Acumulado",
    vm.monthly_target AS "Meta_Mensal",
    va.value_accumulated - COALESCE(LAG(va.value_accumulated, 1) OVER (
        PARTITION BY va.service_id, va.activity_id, va.indicator_name 
        ORDER BY va.year, va.month
    ), 0) AS "Valor_Inserido_Mensal",
    (va.value_accumulated / (vm.monthly_target * va.month) * 100) AS "Percentual_da_Meta"
FROM
    vw_indicator_accumulated va
JOIN
    vw_goals_monthly vm ON va.service_id = vm.service_id
    AND va.activity_id = vm.activity_id
    AND va.indicator_name = vm.indicator_name
    AND va.year = vm.year
    AND va.month = vm.month
JOIN
    services s ON va.service_id = s.id
JOIN
    activities a ON va.activity_id = a.id
JOIN
    indicators i ON va.indicator_name = i.indicator_name
ORDER BY
    va.year, va.month;
-- Inserir notificações entre usuários
INSERT INTO notifications (sender_id, receiver_id, title, message, created_at, updated_at) VALUES 
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM users WHERE email = 'coo@example.com'), 'Lembrete', 'Inserir dados Fevereiro', NOW(), NULL),
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM users WHERE email = 'coo@example.com'), 'Lembrete', 'Inserir dados Março', NOW(), NULL),
((SELECT id FROM users WHERE email = 'coo@example.com'), (SELECT id FROM users WHERE email = 'admin@example.com'), 'Dúvida', 'Quando Inserir dados de Abril?', NOW(), NULL),
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM users WHERE email = 'coo@example.com'), 'Lembrete', 'Inserir dados Janeiro', NOW(), NULL),
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM users WHERE email = 'coo@example.com'), 'Lembrete', 'Inserir dados Agosto', NOW(), NULL);