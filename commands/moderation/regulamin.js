const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    id: '?',
    ephemeral: true,
    type: 'moderation',
    desc: 'Regulamin updater.',
    data: new SlashCommandBuilder()
    .setName('regulamin')
    .setDescription('Aktualizuje regulamin.'),
    async execute(interaction) {
        const reg = new EmbedBuilder()
        .setTitle('Regulamin serwera AI Hub Polska')
        .setThumbnail(interaction.guild.iconURL())
        .setColor('#ff0000')
        .addFields(
            { name: '__§ 1 Postanowienia ogólne__', value: '> `1.` Nieprzestrzeganie regulaminu wiąże się z otrzymaniem kary, o której decyduje moderacja lub administracja.\n> `2.` Nieznajomość regulaminu nie zwalnia z jego przestrzegania.\n> `3.` Administracja ma pełne prawa do zmieniania regulaminu bez wcześniejszego powiadomienia użytkowników o zmianie.\n> `4.` Stosujemy się do zasad wprowadzonych przez Discord ([ToS](https://discordapp.com/terms) | [Guidelines](https://discord.com/guidelines))\n> `5.` Każde niedopatrzenie należy bezzwłocznie zgłosić administracji.\n> `6.` Nie rób głupot, po prostu. Na serwerze mamy zazwyczaj luźną atmosferę i niełatwo jest się przegryźć przez granicę. Wszystko w granicach rozsądku.\n> `7.` Administrator, jeśli uzna to za słuszne, ma prawo do ukarania użytkownika za rzecz niewskazaną w regulaminie.\n> `8.` Zakaz wzniecania dyskusji, które mogą wywołać kontrowersje lub są społecznie nieakceptowane. To nie serwer od tego.' },
            { name: '__§ 2 Serwer discord__', value: '> `1.` Należy korzystać z kanałów zgodnie z ich przeznaczeniem.\n> `2.` Na serwerze panuje kategoryczny zakaz postowania treści nieodpowiednich i mogących wzbudzać kontrowersje.\n> `3.` Nie reklamuj się bez zgody administratora.\n> `4.` Na serwerze zakazane jest prowadzenie handlu i monetyzowanie jakichkolwiek prac.\n> `5.` Surowo zakazane jest używanie AI do podszywania się pod kogoś, szerzenia dezinformacji, obrażania kogoś lub jego uczuć/poglądów.\n> `6.` Zanim zapostujesz coś na kanał <#1124570199018967075> lub <#1126081259546886174>, upewnij się, że ktoś już tego nie zrobił.\n> `7.` Nie nadużywaj botów i nie działaj na szkodę serwera.\n> `8.` Postując model, upewnij się, że jest zgodny z templatem dostępnym na kanale <#1124672691664867398>.' }
        )
        .setFooter({ text: 'Ostatnia aktualizacja' })
        .setTimestamp(Date.now());

        const accpet = new ButtonBuilder().setCustomId('regaccept').setLabel('Akceptuję regulamin').setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(accpet);
        const message = await interaction.guild.channels.cache.get('1124568809001459712').messages.fetch('1136054463266828408');
        await message.edit({ embeds: [reg], components: [row] });
        await interaction.followUp({ content: 'Regulamin zaaktualizowany!' });
    }
}