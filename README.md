# Projeto exemplo asp net mvc com .NET CORE 2.0 e google maps api  

Para executar esse projeto exemplo, é necessário que as seguintes ferramentas estejam instaladas e configuradas.

- [.NET Core SDK](https://www.microsoft.com/net/download/core)
- [Git bash](https://git-scm.com/downloads) ***Windows**
- [Docker](https://www.docker.com/)

## Executar o projeto embarcado no container

Você pode criar e executar o container utilizando os seguintes comandos:

```bash
cd iafmap
docker build -t iafmap .
docker run -it --rm -p 8000:80 --name iafmap_sample iafmap
```

Depois que a aplicação iniciar, acesse [http://localhost:8000/](http://localhost:8000/).

Nota: O parâmetro `-p` mapeia a porta 8000 da sua máquina local para a porta 80 no container.

## Executar o projeto localmente

Você pode compilar e executar o projeto localmente com o [.NET Core 2.0 SDK](https://www.microsoft.com/net/download/core) utilizando os seguintes comandos: 

```bash
cd iafmap
dotnet restore
dotnet run
```

Depois que a aplicação iniciar, acesse [http://localhost:8000/](http://localhost:8000/).

## Criar um pacote para deploy

Você também pode criar um pacote da aplicação, pronto para deploy em produção, com os seguintes comandos:

```bash
dotnet publish -c release -o published
```

Você pode rodar a aplicação no **Windows** usando o seguinte comando:

```bash
dotnet published\iafmap.dll
```

Você pode rodar a aplicação no **Linux or macOS** usando o seguinte comando:

```bash
dotnet published/iafmap.dll
```

Nota: O parâmetro `-c release` compila a aplicação no mode release (o padrão é modo debug). Veja mais em [dotnet run reference](https://docs.microsoft.com/dotnet/core/tools/dotnet-run).

#

## Docker Images

As seguintes imagens são utilizadas nos exemplos

* [microsoft/aspnetcore-build:2.0](https://hub.docker.com/r/microsoft/aspnetcore-build)
* [microsoft/aspnetcore:2.0](https://hub.docker.com/r/microsoft/aspnetcore/)

## Outros recursos relacionados

* [ASP.NET Core Getting Started Tutorials](https://www.asp.net/get-started)
* [.NET Core Production Docker sample](../dotnetapp-prod/README.md)
* [.NET Core Docker samples](../README.md)
* [.NET Framework Docker samples](https://github.com/Microsoft/dotnet-framework-docker-samples)
