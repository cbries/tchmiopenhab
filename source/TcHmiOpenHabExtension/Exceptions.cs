using System;

namespace TcHmiOpenHabExtension
{
    internal class ClientEventException : Exception
    {
        public ClientEventException(string message, Exception ex) : base(message, ex)
        {

        }
    }
}
