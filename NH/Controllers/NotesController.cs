using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NH.Data;
using NH.Models.Entities;

namespace NH.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : Controller
    {
        private readonly NotesDBContext notesDatabase;

        public NotesController(NotesDBContext notesDB)
        {
            notesDatabase = notesDB;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotes()
        {
            // get notes from db
            return Ok(await notesDatabase.Notes.ToListAsync());
        }

        [HttpGet]
        [Route("{id:Guid}")]
        [ActionName("GetNoteById")]
        public async Task<IActionResult> GetNoteById([FromRoute]Guid id)
        {

           var note =  await notesDatabase.Notes.FirstOrDefaultAsync(x => x.Id == id);
            if (note == null)
            {
                return NotFound();
            }
            return Ok(note);
        }

        [HttpPost]
        public async Task<IActionResult> AddNote(Note note)
        {
            note.Id = Guid.NewGuid();
            await notesDatabase.Notes.AddAsync(note);
            await notesDatabase.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNoteById), new {id = note.Id}, note);
        }

        [HttpPut]
        [Route("{id:Guid}")]

        public async Task<IActionResult> UpdateNote([FromRoute]Guid id, [FromBody] Note updatedNote)
        {
            var existingNote = await notesDatabase.Notes.FindAsync(id);
            if(existingNote == null)
            {
                return NotFound();
            }

            existingNote.Title = updatedNote.Title;
            existingNote.Description = updatedNote.Description;
            existingNote.Color = updatedNote.Color;
            existingNote.IsMarked = updatedNote.IsMarked;

           await notesDatabase.SaveChangesAsync();

            return Ok(existingNote);


        }


        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteNote([FromRoute] Guid id)
        {
            var note = await notesDatabase.Notes.FindAsync(id);
            if(note == null)
            {
                return NotFound();
            }
            notesDatabase.Notes.Remove(note);
            await notesDatabase.SaveChangesAsync();

            return Ok();
        }
    }



}
