const {Client, GatewayIntentBits, EmbedBuilder, ActivityType} = require('discord.js');


require('dotenv').config()



// Creating an http endpoint

const express = require("express");
const { checkValidity } = require('./tesseract');
const app = express()

app.head("/", (req, res)=> {
    res.send("pinged");
});

app.get("/", (req, res)=> {
    res.send("pinged");
});


const token = process.env.TOKEN

const ROLES = JSON.parse(process.env.ROLES)

const ROLE_SELECT_CHANNEL_ID = process.env.ROLE_SELECT_CHANNEL_ID;

const verify = require('./search').isStudent;


// Initaliazing the Discord CLient
const discord = new Client({
    intents:[ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers
    ]
});

// Starting up
discord.once("ready", () => {
    console.log('listening');
    discord.user.setActivity(
        'ENSIA Students',
        {
            type: ActivityType.Watching
        }
    )
});


discord.on("messageCreate", async (message) => {
    try {
        console.log(message);
    // if( message.channel.id !== ROLE_SELECT_CHANNEL_ID) return; 
    if (message.attachments.size > 0) {
        message.attachments.forEach(async (att) => {
            if (att.contentType.startsWith("image/")) 
            {
                const valid = await checkValidity(att.url);

                
                console.log(valid);
                if (valid) {
                    const embed = new EmbedBuilder()
                    .setTitle(`Welcome To ENSIA server!`)
                    .setDescription('Please Be respectfull to the memebres of the server')
                    .setThumbnail("https://cdn.discordapp.com/attachments/883123349553831967/1003753214698590248/weee.png");
                    const role = message.guild.roles.cache.find(role => role.name === ROLES[1]);
                    const pending = message.guild.roles.cache.find(role => role.name === ROLES[-1]);
                    const ensia_pending = message.guild.roles.cache.find(role => role.name === ROLES[0])
                    await message.reply({embeds: [embed],  ephemeral: true});
                    await message.member.roles.add(role);
                    await message.member.roles.remove(pending);
                    await message.member.roles.remove(ensia_pending);
                }
            }
        })
    }
}  catch (err){
    await interaction.reply({content:"An Error has occured, Please contact a moderation member!", ephemeral:true});
    console.log(err);
}
})
discord.on("interactionCreate", async (interaction) => {
    try {
        if( interaction.channel.id !== ROLE_SELECT_CHANNEL_ID ) { 
            console.log(interaction.channel.id);
            await interaction.reply({content: "I don't have access to this channel :')", ephemeral: true});
            return;
        }
        if (!interaction.isChatInputCommand()) return;          // Only check for chat input commands
        if (interaction.commandName === 'verify'){              // Check the command name
            // storing the coresponding inputs
            const email = interaction.options.getString('email');
            const student = await require('./contacts.json')[email];
            
            if (verify(email)){       // check if ENSIA student
                const name = student[0];
                const year = student[1];

                await interaction.member.setNickname(name); 

                // embed to show when verified as ENSIA student
                const embed = new EmbedBuilder()
                .setTitle(`Welcome To ENSIA server!`)
                .setDescription('Please Be respectfull to the memebres of the server')
                .setThumbnail("https://cdn.discordapp.com/attachments/883123349553831967/1003753214698590248/weee.png");
                

                const role = interaction.guild.roles.cache.find(role => role.name === ROLES[year]);
                const pending = interaction.guild.roles.cache.find(role => role.name === ROLES[-1]);
                const ensia_pending = interaction.guild.roles.cache.find(role => role.name === ROLES[0]);

                await interaction.reply({embeds: [embed]});
                await interaction.member.roles.add(role);
                await interaction.member.roles.remove(pending);
                await interaction.member.roles.remove(ensia_pending);
            }
        else {
            await interaction.reply({content: "You are **__NOT an ENSIA__** student, Please contact one of the Moderation", ephemeral: true});
        }
    }
    

} catch (err){
    await interaction.reply({content:"An Error has occured, Please contact a moderation member!", ephemeral:true});
    console.log(err);
}
})



discord.login(token);

app.listen(process.env.PORT || 3000);