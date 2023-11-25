try{
    require("dotenv").config();
} catch(e){
    console.log(e, "no se ha podido hacer el dotenv");
}
const {Client, IntentsBitField, REST, Routes, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType} = require("discord.js");//npm install discord.js
//REST, Routes, ApplicationCommandOptionType son para los comandos / y se suele hacer en un script aparte
//EmbedBuilder es para las cosas empotradas
//ActivityType es para el status del perfil
const client = new Client({//obligatorio ponerlo, que tipo de eventos escuchara el bot
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent]});





const roles = [//variable con los roles que manejara el bot, los id se copian desde ajustes
    {
        id: "1176946754952904835",
        label: "verde"
    },
    {
        id: "1176946792500318308",
        label: "rojo"
    },
    {
        id: "1176946833361211472",
        label: "azul"
    }
];

client.on('ready', async (c) => {//esto se ejecuta cuando x pase (este es cuando se inicie)
    console.log("bot iniciado", c.user.tag);
    client.user.setActivity({name: "haciendo cosas", type: ActivityType.Streaming, url:"about:blank"});//status del perfil del bot
});
//--------------------------------------------------------------------------------------------------------------------

let VOLVER_A_REGISTRAR_COMANDOS = true;//no hace falta registrar los comandos cada vez que se inicia el bot
if(VOLVER_A_REGISTRAR_COMANDOS){
    const commands = [//comandos funcionales con / (esto se suele hacer en un .json)
    {
        name: "saludar",
        description: "te digo hola"
    },
    {
        name: "ping",
        description: "hace ping"
    },
    {
        name: "roles",
        description: "pone los botones de los roles"
    },
    {
        name: "suma",
        description: "sumar numeros",
        options :[//para que los comandos reciban parametros
            {
                name: "primero",
                description: "primer numero a sumar",
                type: ApplicationCommandOptionType.Number,//tipo de parametro
                required: true,//si es obligatorio
                choices:[//dejara poner rapidamente uno de estos valores al escribir este parametro
                    {
                        name: "uno",
                        value: 1
                    },
                    {
                        name: "dos",
                        value: 2
                    }
                ]
            },
            {
                name: "segundo",
                description: "segundo numero a sumar",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: "embed",
        description: "envia un embed (cosa empotrada)"
    }
];
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);
(async()=>{
    try{
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {body: commands});
        console.log("terminado regitrando comandos / slash...");
    }catch(error){ console.log("error", error);}
})();
client.on('interactionCreate', async (interaction)=>{//lo que hace con cada comando /
    if(!interaction.isChatInputCommand() && !interaction.isButton()) return;
    if(interaction.commandName === "saludar"){//por cada comando
        interaction.reply("hola");//debe haber un reply
    }
    if(interaction.commandName === "ping"){
        interaction.reply("pong");
    }
    if(interaction.commandName === "suma"){
        const num1 = interaction.options.get("primero").value;//recibir parametros de comando
        const num2 = interaction.options.get("segundo").value;
        interaction.reply("la respuesta es " + (num1 + num2));
    }
    if(interaction.commandName === "embed"){
        const embed = new EmbedBuilder()//crear embed
        .setTitle("titulo")
        .setDescription("descripcion")
        .setColor("Random")//se puede poner un color con hexadecimal en el ""
        .addFields({name: "nombre", value: "propiedad", inline: true}, {name: "nombre2", value: "asdfasdf", inline: true})//poner valor adentro, inline es para que se ponga en horizontal
        ;//hay muchas mas propiedades, algunas relacionadas con imagenes
        interaction.reply({embeds: [embed]});//enviar
    }
    if(interaction.commandName === "roles"){
        try{
            const channel = await client.channels.cache.get("1176614622560788711");//devuelve como variable un canal de texto, el id se copia desde alli
            if(!channel)return;
            const row = new ActionRowBuilder();//espacio para botones
            roles.forEach((role)=>{
                row.components.push(new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary));//agregar boton, en este caso en base a los roles de antes
            });
            await channel.send({content: "gestiona tus roles", components: [row]});//enviar mensaje con los botones de los roles
            interaction.reply("elige el que quieras");
        } catch(e){console.log(e);}
    }
    if(interaction.isButton()){
        try{
            await interaction.deferReply({ephemeral: true});
            const role = interaction.guild.roles.cache.get(interaction.customId);//busca un rol en el servidor, recibiendo como entrada el id de rol del boton
            if(!role){
                interaction.editReply({content: "no encontre el rol", ephemeral: true});
                return;
            }
            const hasRole = interaction.member.roles.cache.has(role.id);//devuelve si el miembro tiene x rol
            if(hasRole){
                await interaction.member.roles.remove(role);//quitar un rol a un usuario
                await interaction.editReply("ya no tienes el rol " + role);
                return;
            }
            await interaction.member.roles.add(role);//agrega un rol a un usuario
            await interaction.editReply("ahora tienes el rol " + role);
        } catch(e){console.log(e);}
    }
});
}//






//--------------------------------------------------------------------------------------------------------------------


client.on('messageCreate', (message) => {//se ejecuta cuando alguien dice algo, message es la variable
    if(message.author.bot){
        return;//comprobar si el mensaje viene de otro bot
    }
    if(message.content === "hola"){
        message.reply("holaa");//responder
    }
    if(message.content === "adios"){
        message.channel.send("holaa");//enviar mensaje talcual
    }
});





//--------------------------------------------------------------------------------------------------------------------
client.login(process.env.TOKEN);//token del bot en discord.com/developers/applications
