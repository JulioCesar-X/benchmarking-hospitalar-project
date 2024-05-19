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
INSERT INTO user_roles (user_id, role_id) VALUES
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM roles WHERE role_name = 'Admin')),
((SELECT id FROM users WHERE email = 'coo@example.com'), (SELECT id FROM roles WHERE role_name = 'Coordenador')),
((SELECT id FROM users WHERE email = 'cola@example.com'), (SELECT id FROM roles WHERE role_name = 'Colaborador'));

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
((SELECT id FROM services WHERE service_name = 'Hospital Dia'), NULL, (SELECT id FROM indicators WHERE indicator_name = 'Encargos/Sessão'), 'financeiro'),
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


-- Inserindo metas anuais na tabela goals
-- Psiquiatria Adultos
INSERT INTO goals (service_activity_indicator_id, target_value, year, created_at, updated_at) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Consultas Total')), 42856, 2024, NOW(), NOW()),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 10451, 2024, NOW(), NOW()),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Adultos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 32405, 2024, NOW(), NOW());

-- Psiquiatria Infância e Adolescência
INSERT INTO goals (service_activity_indicator_id, target_value, year, created_at, updated_at) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Consultas Total')), 8803, 2024, NOW(), NOW()),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Primeiras Consultas')), 1556, 2024, NOW(), NOW()),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Psiquiatria Infância e Adolescência') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Consultas Subsequentes')), 4559, 2024, NOW(), NOW());

-- Quadro Resumo
INSERT INTO goals (service_activity_indicator_id, target_value, year, created_at, updated_at) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de 1ªs Consultas Médicas')), 12006, 2024, NOW(), NOW()),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Consulta Externa') AND activity_id = (SELECT id FROM activities WHERE activity_name = 'Quadro Resumo') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº de Consultas Médicas Subsequentes')), 36964, 2024, NOW(), NOW());

-- Internamento Agudos
INSERT INTO goals (service_activity_indicator_id, target_value, year, created_at, updated_at) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Agudos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Lotação')), 406, 2024, NOW(), NOW());

-- Internamento Crónicos
INSERT INTO goals (service_activity_indicator_id, target_value, year, created_at, updated_at) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Dias de Internamento (Totais) Doentes Crónicos')), 13054, 2024, NOW(), NOW()),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos(HPA)')), 23, 2024, NOW(), NOW()),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Internamento Crónicos') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Demora média Crónicos (Santa Casa Misericórdia Amarante)')), 10, 2024, NOW(), NOW());

-- Hospital Dia
INSERT INTO goals (service_activity_indicator_id, target_value, year, created_at, updated_at) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Sessões Total')), 23, 2024, NOW(), NOW()),
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Hospital Dia') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Nº Doentes')), 10, 2024, NOW(), NOW());

-- Serviço Domiciliário
INSERT INTO goals (service_activity_indicator_id, target_value, year, created_at, updated_at) VALUES
((SELECT id FROM service_activity_indicators WHERE service_id = (SELECT id FROM services WHERE service_name = 'Serviço Domiciliário') AND indicator_id = (SELECT id FROM indicators WHERE indicator_name = 'Total de Visitas Domiciliárias')), 7934, 2024, NOW(), NOW());

-- Inserir notificações entre usuários
INSERT INTO notifications (sender_id, receiver_id, title, message, created_at, updated_at) VALUES
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM users WHERE email = 'coo@example.com'), 'Lembrete', 'Inserir dados Fevereiro', NOW(), NULL),
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM users WHERE email = 'coo@example.com'), 'Lembrete', 'Inserir dados Março', NOW(), NULL),
((SELECT id FROM users WHERE email = 'coo@example.com'), (SELECT id FROM users WHERE email = 'admin@example.com'), 'Dúvida', 'Quando Inserir dados de Abril?', NOW(), NULL),
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM users WHERE email = 'coo@example.com'), 'Lembrete', 'Inserir dados Janeiro', NOW(), NULL),
((SELECT id FROM users WHERE email = 'admin@example.com'), (SELECT id FROM users WHERE email = 'coo@example.com'), 'Lembrete', 'Inserir dados Agosto', NOW(), NULL);



