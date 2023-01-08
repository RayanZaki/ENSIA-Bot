const {Client, GatewayIntentBits, EmbedBuilder, TextChannel} = require('discord.js');


require('dotenv').config()



// Creating an http endpoint

const express = require("express");
const app = express()

app.head("/", (req, res)=> {
    res.send("pinged");
});

app.get("/", (req, res)=> {
    res.send("pinged");
});


const token = process.env.TOKEN


const verify = require('./search').isStudent;


// Initaliazing the Discord CLient
const discord = new Client({
    intents:[ GatewayIntentBits.Guilds]
});

// Starting up
discord.once("ready", () => {
    console.log('listening');
});

discord.on("interactionCreate", async (interaction) => {
    try {
        if( interaction.channel.id != 1004682149179424798 ) { 
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
                
                await interaction.reply({embeds: [embed]});
                await interaction.member.roles.add( (year === 1) ? "1004385054182604841" : "879492497586405426");
                await interaction.member.roles.remove("879525571988709446");
                await interaction.member.roles.remove("879534939719233546");
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