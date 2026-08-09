FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Student Housing Platform/Student Housing Platform.csproj","Student Housing Platform/"]
RUN dotnet restore "Student Housing Platform/Student Housing Platform.csproj"
COPY . .
WORKDIR "/src/Student Housing Platform"
RUN dotnet build "Student Housing Platform.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Student Housing Platform.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "\"Student Housing Platform.dll\""]
