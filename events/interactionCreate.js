const { Events, Collection, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            const { cmdcooldowns } = interaction.client;

            if (!cmdcooldowns.has(command.data.name)) {
                cmdcooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cmdcooldowns.get(command.data.name);
            const defaultCooldownDuration = 0;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 60000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({ content: `Tej komendy będziesz mógł użyć <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    
            if (command.ephemeral) {
                await interaction.deferReply({ ephemeral: true });
            }
            else {
                await interaction.deferReply();
            }
    
            try {
    
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Error xd', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Error xd', ephemeral: true });
                }
            }
        }
        else if (interaction.isButton()) {
            if (interaction.customId === 'regaccept') {
                if (interaction.member.roles.cache.has('1136044660016554037')) return await interaction.reply({ content: 'Już zaakceptowałeś regulamin :)', ephemeral: true });
                const modal = new ModalBuilder().setCustomId('verify').setTitle('Potwierdź, że nie jesteś botem!');
                let n1 = randomInt(10); n2 = randomInt(10);
                interaction.client.captcha[interaction.member.id] = n1 + n2;
                const captcha = new TextInputBuilder().setCustomId('captcha').setLabel(`${n1} + ${n2}`).setStyle(TextInputStyle.Short).setPlaceholder('Podaj wynik powyższego działania...').setRequired(true).setMaxLength(2).setMinLength(1);
                const row = new ActionRowBuilder().addComponents(captcha);
                modal.addComponents(row);
                await interaction.showModal(modal);
            }
            else if (interaction.customId === 'info1') {
                const e = new EmbedBuilder()
                .setTitle('Oddzielanie wokali')
                .setDescription('- [UVR](https://ultimatevocalremover.com/)\n- [X-MINUS](https://x-minus.pro/ai)\n- [Vocal Remover](https://vocalremover.org/)\n\nNajbardziej wydajnym i efektownym jest UVR, który z odpowiednimi ustawieniami robi dobrą robotę. Moderator <@183283323999617024> zrobił fajny tutorial do ustawień w UVR w [tej wiadomości](https://discord.com/channels/1124566634456174605/1124566636020633662/1137433709260312616)')
                .setColor('#ff0000');
                await interaction.reply({ embeds: [e], ephemeral: true });
            }
            else if (interaction.customId === 'info2') {
                const e = new EmbedBuilder()
                .setTitle('Tworzenie coverów/modeli - Strony')
                .setDescription('- [EasyGUI na Google Colab](https://colab.research.google.com/drive/1r4IRL0UA7JEoZ0ZK8PKfMyTIBHKpyhcw)*\n- [Applio na Google Colab](https://applio.iahispano.com/)*\n- [AIO Inference Colab](https://colab.research.google.com/github/ardha27/AICoverGen-NoUI-Colab/blob/main/CoverGen_No_UI.ipynb) (Brak interfejsu webowego)\n- [Easy Training Colab](https://colab.research.google.com/drive/1r4IRL0UA7JEoZ0ZK8PKfMyTIBHKpyhcw) (Brak interfejsu webowego)\n- [Applio na Huggingface Spaces](https://huggingface.co/spaces/r3gm/RVC_HF) (W fazie testów, powolne)\n- [Kits.ai](https://www.kits.ai/)\n- [Voicemy.ai](https://www.voicemy.ai/)\n- Banger, aplikacja na [Android](https://play.google.com/store/apps/details?id=ai.cover.song.voicify) i [iOS](https://apps.apple.com/ae/app/id6452017015)\n\n*Google ostatnio blokuje postawione na colabie RVC pod pretekstem podejrzanych aktywności, przez co sesje się bugują, crashują i rozłączają. Zalecane jest używanie programów lokalnie lub stron nieoznaczonych gwiazdką.*')
                .setColor('#ff0000');
                await interaction.reply({ embeds: [e], ephemeral: true });
            }
            else if (interaction.customId === 'info3') {
                const e = new EmbedBuilder()
                .setTitle('Tworzenie coverów/modeli - Lokalnie')
                .setDescription('- [Applio-RVC](https://github.com/IAHispano/Applio-RVC-Fork) ([Poradnik](https://docs.applio.org/installation/requirements/))\n- [Mangio-RVC](https://github.com/Mangio621/Mangio-RVC-Fork)\n- [VoiceConversionWebUI](https://huggingface.co/lj1995/VoiceConversionWebUI/tree/main)\n- [Aplikacja Replay](https://www.tryreplay.io/)\n- [RVC Studio](https://github.com/SayanoAI/RVC-Studio)')
                .setColor('#ff0000');
                await interaction.reply({ embeds: [e], ephemeral: true });
            }
            else if (interaction.customId === 'info4') {
                const e = new EmbedBuilder()
                .setTitle('Poradniki')
                .setDescription('- [RVC v2 AI Cover Guide (by kalomaze)](https://docs.google.com/document/d/13_l1bd1Osgz7qlAZn-zhklCbHpVRk6bYOuAuB78qmsE/edit?usp=sharing)\n- [Jak zrobić AI Cover (RVC2)](https://www.youtube.com/watch?v=8V4qI8ta_bU) (Film nagrany przez <@1026518790848122931>)\n- [Trenowanie modeli RVC v2 Poradnik](https://docs.google.com/document/d/1SQnkXCuEZw4ZO5voi1jxPXCwffvR3fNxYBbox2O5UaM/edit?usp=sharing) (by <@350691811280420864>)\n- [Tworzenie Coverów AI w RVC v2 Poradnik](https://docs.google.com/document/d/1mTO740MwvAdlzcmUMeviw7A_oo0ErLWDdRetLcAQ9Hw/edit?usp=sharing) (by <@350691811280420864>)')
                .setColor('#ff0000');
                await interaction.reply({ embeds: [e], ephemeral: true });
            }
            else if (interaction.customId === 'info5') {
                const e = new EmbedBuilder()
                .setTitle('FAQ')
                .setDescription('Wybierz z poniższej listy pytanie, na które chcesz znać odpowiedź.')
                .setColor('#ff0000');

                const select = new StringSelectMenuBuilder().setCustomId('faq').setPlaceholder('Wybierz pytanie!').addOptions(
                    new StringSelectMenuOptionBuilder().setLabel('Czym jest trenowanie modelu głosu?').setValue('pyt1'),
                    new StringSelectMenuOptionBuilder().setLabel('Czy mogę podzielić się swoimi projektami?').setValue('pyt2'),
                    new StringSelectMenuOptionBuilder().setLabel('Czy mogę poprosić o pomoc w rozwiązywaniu problemów?').setValue('pyt3'),
                    new StringSelectMenuOptionBuilder().setLabel('Jak wytrenować swój model AI?').setValue('pyt4'),
                    new StringSelectMenuOptionBuilder().setLabel('Jak zrobić swój cover AI?').setValue('pyt5'),
                    new StringSelectMenuOptionBuilder().setLabel('Mój AI cover brzmi źle/nie jest czysty, dlaczego?').setValue('pyt6'),
                    new StringSelectMenuOptionBuilder().setLabel('Czym jest epoch?').setValue('pyt7'),
                    new StringSelectMenuOptionBuilder().setLabel('Jaki typ ekstrakcji wybrać?').setValue('pyt8'),
                    new StringSelectMenuOptionBuilder().setLabel('Co się stało z Google Colab?').setValue('pyt9'),
                    new StringSelectMenuOptionBuilder().setLabel('Czym jest Tensorboard?').setValue('pyt10')
                );
                const row = new ActionRowBuilder().addComponents(select);
                await interaction.reply({ embeds: [e], components: [row], ephemeral: true });
            }
            else if (interaction.customId === 'ogloszenia') {
                const role = await interaction.guild.roles.fetch('1145641140486422528');
                if (interaction.member.roles.cache.has(role.id)) {
                    await interaction.member.roles.remove(role);
                    await interaction.reply({ content: 'Usunięto rolę **Ogłoszenia**!', ephemeral: true });
                }
                else {
                    await interaction.member.roles.add(role);
                    await interaction.reply({ content: 'Dodano rolę **Ogłoszenia**!', ephemeral: true });
                }
            }
        }
        else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'verify') {
                if (interaction.client.captcha[interaction.member.id] == interaction.fields.getTextInputValue('captcha')) {
                    const role = await interaction.guild.roles.fetch('1136044660016554037');
                    await interaction.member.roles.add(role);
                    await interaction.reply({ content: 'Pomyślnie zweryfikowano! :)', ephemeral: true });
                }
                else {
                    await interaction.reply({ content: 'Nieprawidłowy wynik działania, spróbuj ponownie.', ephemeral: true });
                }
            }
        }
        else if (interaction.isChannelSelectMenu) {
            if (interaction.customId === 'faq') {
                if (interaction.values[0] === 'pyt1') {
                    const e = new EmbedBuilder().setTitle('Czym jest trenowanie modelu głosu?').setDescription('Trenowanie głosów w modelach AI wykorzystuje algorytmy uczenia maszynowego do naśladowania i generowania głosów. Wytrenowany model głosu możemy wykorzystać do np. coveru jakiejś piosenki.').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt2') {
                    const e = new EmbedBuilder().setTitle('Czy mogę podzielić się swoimi projektami?').setDescription('Oczywiście! Zachęcamy do dzielenia się swoimi projektami i doświadczeniami. Jeśli chcesz się pochwalić utworzonym modelem głosowym utwórz post na <#1124570199018967075> (zgodnie z templatem). Jeśli chcesz się pochwalić utworzonym coverem, udostępnij go na <#1124738420405702837> lub <#1138199294822862858> (zgodnie z przeznaczeniem kanału).').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt3') {
                    const e = new EmbedBuilder().setTitle('Czy mogę poprosić o pomoc w rozwiązywaniu problemów?').setDescription('Tak, na tym serwerze znajdziesz społeczność gotową do pomocy. Możesz śmiało zadawać pytania i prosić o wsparcie w rozwiązywaniu problemów na kanale <#1133734121378680832>').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt4') {
                    const e = new EmbedBuilder().setTitle('Jak wytrenować swój model AI?').setDescription('Szczegółowy poradnik dot. trenowania modelu głosowego znajdziesz pod przyciskiem **Poradniki**.').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt5') {
                    const e = new EmbedBuilder().setTitle('Jak zrobić swój cover AI?').setDescription('Szczegółowy poradnik dot. tworzenia coveru AI znajdziesz pod przyciskiem **Poradniki**.').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt6') {
                    const e = new EmbedBuilder().setTitle('Mój AI cover brzmi źle/nie jest czysty, dlaczego?').setDescription('Rezultat covera jest zależny od wielu czynników i nie zawsze jest to twoja wina. Pamiętaj, aby twój cover brzmiał dobrze ważne jest, aby:\n- Wokal podany do konwersji nie miał żadnych intrumentali/dzwięków w tle/itp. Ponadto powinien on być czysty i mieć mało przerw.\n- Używać dobrego modelu głosu. Model, którego używasz być może jest niepełny lub po prostu nie radzi sobie z tego typu konwersją.\n- Dobrać odpowiedni sposób konwersji i pitch. Rezultat może wyjść dobrze na defaultowych ustawieniach programu, ale nie zawsze. Upewnij się, że testowałeś różne sposoby konwersji (harvest, crepe, mangio-crepe, rmvpe itp.) i pitchu (dodawanie lub odejmowanie jego wartości).').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt7') {
                    const e = new EmbedBuilder().setTitle('Czym jest epoch?').setDescription('Epoch to liczba iteracji wykonywanych podczas szkolenia w celu ukończenia jednego pełnego cyklu zbioru danych. Na przykład, jeśli masz zbiór danych składający się z 200 próbek audio i ustawisz batch_size na 10, 10 próbek audio zostanie przetworzonych w każdej iteracji. Aby przetworzyć wszystkie 200 próbek audio, należy wykonać łącznie 20 iteracji. Ten pełny cykl jest określany jako jeden epoch. Więc 300 Epochs oznacza, że podczas trenowania modelu sztuczna inteligencja przeszła 300 razy przez cały zbiór danych.').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt8') {
                    const e = new EmbedBuilder().setTitle('Jaki typ ekstrakcji wybrać?').setDescription('- **pm**: Zapewnia szybki, ale nieefektywny wynik i jest mniej wydajny model głosu.\n- **Harvest**: Oferuje lepszą replikację dźwięków z naszej Acapelli, ale jest wolniejszy i często początkowo wyświetla błędy.\n- **Dio**: Może być używany w momentach, gdy nasza Acapella ma szybką wymowę słów, na przykład w rapie.\n- **Crepe-tiny**: Podobne do crepe, przetwarza szybciej, ale z mniejszą agresywnością.\n- **Mangio-crepe**: Zapewnia lepsze wyniki pod względem oddechów i działa tak samo jak crepe, ale jest wolniejszy i czasami daje gorsze wyniki.\n- **Mangio-crepe-tiny**: Podobnie jak mangio-crepe, jest szybszy, ale mniej agresywny.\n- **rmvpe**: Jest to połączenie pm i crepe, ale jest szybkie zarówno w przypadku szkolenia, jak i wnioskowania. Jest najbardziej wydajny modelowi głosowemu (obecnie najlepsza opcja).').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt9') {
                    const e = new EmbedBuilder().setTitle('Co się stało z Google Colab?').setDescription('Niestety, Google Colab jest obecnie niedostępny, ponieważ Google podjął środki w celu ograniczenia dostępu do usług Colab, w tym Applio. Uprzejmie prosimy o powstrzymanie się od zadawania tego pytania w przyszłości, ponieważ sytuacja pozostaje niezmieniona.').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
                else if (interaction.values[0] === 'pyt10') {
                    const e = new EmbedBuilder().setTitle('Czym jest Tensorboard?').setDescription('Tensorboard to seria wykresów, na których możemy monitorować postępy naszego modelu podczas treningu, ale istnieje wiele wykresów. Nas interesuje tylko wykres o nazwie "g/total". Można go znaleźć wybierając "SCALARS" i wpisując wcześniej wymienioną frazę w wyszukiwarkę').setColor('#ff0000');
                    interaction.reply({ embeds: [e], ephemeral: true });
                }
            }
        }
	},
};

function randomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}