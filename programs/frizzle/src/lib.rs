use anchor_lang::prelude::*;

declare_id!("5MhHEjob4xzwmWioHPw9DJccaefogEfdRsD9vAMiN7vt");


#[derive(Accounts)]
pub struct SendFreez<'info> {
    #[account(init, payer = author, space = Freez::LEN)]
    pub freez: Account<'info, Freez>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Freez {
    pub author: Pubkey,
    pub timestamp: i64,
    pub topic: String,
    pub content: String,
}
impl Freez {const LEN: usize = 1376;}

#[derive(Accounts)]
pub struct UpdateFreez<'info> {
    #[account(mut, has_one = author)]
    pub freez: Account<'info, Freez>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteFreez<'info> {
    #[account(mut, has_one = author, close = author)]
    pub freez: Account<'info, Freez>,
    pub author: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The provided topic should be 50 characters long maximum.")]
    TopicTooLong,
    #[msg("The provided content should be 280 characters long maximum.")]
    ContentTooLong,
    #[msg("Plese provide some content")]
    NoText,
}

#[program]
pub mod frizzle {
    use super::*;
    pub fn send_freez(ctx: Context<SendFreez>, topic: String, content: String) -> Result<()> {

        let freez: &mut Account<Freez> = &mut ctx.accounts.freez;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();
        
        if content.chars().count() > 280 {return Err(ErrorCode::ContentTooLong.into())}
        if topic.chars().count() > 50 {return Err(ErrorCode::TopicTooLong.into())}
        if content.chars().count() == 0 {return Err(ErrorCode::NoText.into())}
        if topic.chars().count() == 0 {return Err(ErrorCode::NoText.into())}

        freez.author = *author.key;
        freez.timestamp = clock.unix_timestamp;
        freez.topic = topic;
        freez.content = content;
        
        Ok(())
    }

     pub fn update_freez(ctx: Context<UpdateFreez>, topic: String, content: String) -> Result<()> {
        let freez: &mut Account<Freez> = &mut ctx.accounts.freez;

        if topic.chars().count() > 50 {return Err(ErrorCode::TopicTooLong.into())}
        if content.chars().count() > 280 {return Err(ErrorCode::ContentTooLong.into())}

        freez.topic = topic;
        freez.content = content;

        Ok(())
    }

    pub fn delete_freez(_ctx: Context<DeleteFreez>) -> Result<()> {
        Ok(())
    }
}


