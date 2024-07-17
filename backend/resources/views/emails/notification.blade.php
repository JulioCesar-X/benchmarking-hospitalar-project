<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
        }

        .header img {
            width: 50px;
            height: 50px;
        }

        .header h3 {
            margin: 0;
            color: #5b8ead;
        }

        .header h1 {
            margin: 0;
            color: #283044;
        }

        .headingSection {
            width: 100%;
            background-image: url('https://benchmarking-hospitalar-project-1.onrender.com/assets/images/g579.png');
            background-size: cover;
            background-position: center;
            padding: 5% 0;
            margin-bottom: 2em;
            text-align: center;
            border-radius: 10px;
        }

        .headingTitle {
            color: #fff;
            font-size: 2em;
        }

        .content {
            padding: 20px 0;
        }

        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            background-color: #007bff;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #888888;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <a href="http://www.portugal.gov.pt/pt.aspx" target="_blank">
                <img src="https://benchmarking-hospitalar-project-1.onrender.com/assets/images/novoLogo.png" alt="SNS logo image">
            </a>
            <h3>Unidade local de Saúde</h3>
            <h1>Tâmega e Sousa</h1>
        </div>
        <div class="headingSection">
            <h1 class="headingTitle">Departamento Psiquiatria</h1>
        </div>
        <div class="content">
            <h2>Nova Mensagem Recebida</h2>
            <p>Informamos que acabaste de receber uma nova mensagem. Clique no botão abaixo para visualizá-la:</p>
            <a href="{{ $url }}" class="button">Ver Mensagem</a>
            <p>Se você não esperava por essa notificação, nenhuma ação é necessária.</p>
        </div>
        <div class="footer">
            <p>Cumprimentos,<br>Equipe HospMetrics</p>
        </div>
    </div>
</body>

</html>